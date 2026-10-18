import sys
import re
import json
import copy
import types
from typing import Any


def trace_code(code: str, inputs: dict[str, Any]) -> dict:
    """
    Execute user-submitted Python code line by line using sys.settrace().
    Auto-detects standalone functions and class methods.
    Returns rich step data for frontend visualization.

    Snapshots are recorded *after* a line has executed: each frame keeps a
    "pending" line, and its post-execution state is captured when the frame's
    next event arrives. This way each step shows the effect of its own line.
    """
    steps: list[dict] = []
    code_lines = code.split("\n")
    code_line_count = len(code_lines)

    # Detect standalone function or class method
    is_class = bool(re.search(r'class\s+\w+', code))
    call_statement = _build_call_statement(code, inputs, is_class)

    full_code = code + call_statement

    prev_snapshot: dict[str, Any] = {}
    call_stack: list[str] = []
    frame_pending: dict[int, tuple[int, str]] = {}  # id(frame) -> (line, lineText)

    def record_pending_step(frame, stack_snapshot: list[str]):
        """Flush the frame's pending line using its current (post-execution) state."""
        nonlocal prev_snapshot
        pending = frame_pending.pop(id(frame), None)
        if pending is None:
            return
        lineno, line_text = pending
        if not (1 <= lineno <= code_line_count):
            return

        snapshot = _capture_locals(frame)
        added, changed, removed = _diff_vars(prev_snapshot, snapshot)
        prev_snapshot = snapshot

        steps.append({
            "line": lineno,
            "lineText": line_text,
            "vars": snapshot,
            "added": added,
            "changed": changed,
            "removed": removed,
            "callStack": stack_snapshot,
        })

    def trace_calls(frame, event, arg):
        if event == "call":
            func_name = frame.f_code.co_name
            if func_name != "<module>":
                call_stack.append(func_name)
            return trace_lines
        return trace_calls

    def trace_lines(frame, event, arg):
        if event == "line":
            # Current state reflects the previously pending line of this frame
            record_pending_step(frame, list(call_stack))

            lineno = frame.f_lineno
            if 1 <= lineno <= code_line_count:
                frame_pending[id(frame)] = (lineno, code_lines[lineno - 1].strip())
            return trace_lines

        if event == "return":
            # Capture the effect of the frame's final line
            record_pending_step(frame, list(call_stack))
            func_name = frame.f_code.co_name
            if call_stack and call_stack[-1] == func_name:
                call_stack.pop()

        return trace_lines

    try:
        compiled = compile(full_code, "<user_code>", "exec")
        # One namespace for globals and locals: with split namespaces, functions
        # defined at module level cannot resolve themselves/helpers (recursion
        # raises NameError).
        namespace: dict[str, Any] = {
            "__builtins__": __builtins__,
            **inputs,
        }

        sys.settrace(trace_calls)
        exec(compiled, namespace)
        sys.settrace(None)

        # Add result step
        if "__result__" in namespace:
            steps.append({
                "line": 0,
                "lineText": f"return {json.dumps(namespace['__result__'])}",
                "vars": {"__result__": namespace["__result__"]},
                "added": ["__result__"],
                "changed": [],
                "removed": [],
                "callStack": [],
                "isResult": True,
            })

    except Exception as e:
        sys.settrace(None)
        error_line = steps[-1]["line"] if steps else 0
        steps.append({
            "line": error_line,
            "lineText": "",
            "vars": {"__error__": str(e)},
            "added": ["__error__"],
            "changed": [],
            "removed": [],
            "callStack": [],
            "isError": True,
        })

    return {"total": len(steps), "steps": steps, "codeLines": code_lines}


def _build_call_statement(code: str, inputs: dict, is_class: bool) -> str:
    """Build the auto-call statement appended to user code. Deep copies mutable inputs."""
    if is_class:
        class_match = re.search(r'class\s+(\w+)', code)
        method_match = re.search(r'def\s+(\w+)\s*\(\s*self\s*,\s*([^)]*)\)', code)
        if not class_match or not method_match:
            return "\n__result__ = None"

        class_name = class_match.group(1)
        method_name = method_match.group(1)
        params = [p.strip().split(":")[0].strip() for p in method_match.group(2).split(",") if p.strip()]

        args = []
        for p in params:
            if p in inputs:
                val = inputs[p]
                if isinstance(val, (list, dict)):
                    args.append(f"__import__('json').loads(__import__('json').dumps({json.dumps(val)}))")
                else:
                    args.append(json.dumps(val))
            else:
                args.append("None")

        return f"\n__inst = {class_name}()\n__result__ = __inst.{method_name}({', '.join(args)})"
    else:
        func_match = re.search(r'def\s+(\w+)\s*\(([^)]*)\)', code)
        if not func_match:
            return "\n__result__ = None"

        func_name = func_match.group(1)
        params = [p.strip().split(":")[0].strip() for p in func_match.group(2).split(",") if p.strip()]

        args = []
        for p in params:
            if p in inputs:
                val = inputs[p]
                if isinstance(val, (list, dict)):
                    args.append(f"__import__('json').loads(__import__('json').dumps({json.dumps(val)}))")
                else:
                    args.append(json.dumps(val))
            else:
                args.append("None")

        return f"\n__result__ = {func_name}({', '.join(args)})"


def _diff_vars(prev: dict, curr: dict) -> tuple:
    """Compare two variable snapshots, return (added, changed, removed)."""
    added = []
    changed = []
    removed = []

    for k in curr:
        if k.startswith("__"):
            continue
        if k not in prev:
            added.append(k)
        elif prev[k] != curr[k]:
            changed.append(k)

    for k in prev:
        if k.startswith("__"):
            continue
        if k not in curr:
            removed.append(k)

    return added, changed, removed


def _capture_locals(frame) -> dict[str, Any]:
    """Capture local variables from the current frame, serializable to JSON.

    Mutable values are deep-copied: without this, every stored snapshot would
    reference the same object and later mutations would rewrite earlier steps.
    """
    snapshot: dict[str, Any] = {}
    for name, value in frame.f_locals.items():
        if name.startswith("__") and name.endswith("__"):
            continue
        try:
            json.dumps(value)
            snapshot[name] = copy.deepcopy(value)
        except (TypeError, ValueError, OverflowError, RecursionError):
            # Skip function/class/module references — they clutter every frame
            if callable(value) or isinstance(value, types.ModuleType):
                continue
            snapshot[name] = str(value)
    return snapshot
