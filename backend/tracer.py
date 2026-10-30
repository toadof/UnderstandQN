import sys
import re
import ast
import json
import copy
import types
from typing import Any

MAX_STEPS = 1000  # Guard against infinite loops or runaway execution


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

    call_statement = _build_call_statement(code, inputs)
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
            if len(steps) >= MAX_STEPS:
                raise RuntimeError(
                    f"Execution step limit exceeded ({MAX_STEPS} steps). "
                    "Check for infinite loops or reduce input size."
                )

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
            "__copy__": copy,
            "__inputs__": copy.deepcopy(inputs),
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


def _build_call_statement(code: str, inputs: dict) -> str:
    """
    Build the auto-call statement appended to user code.
    Uses Python AST parsing to accurately extract classes, methods, and functions
    without regex brittleness regarding type annotations, comments, or helper functions.
    """
    input_keys = set(inputs.keys())

    try:
        tree = ast.parse(code)
    except Exception:
        # If code has syntax errors, fall back; compile() in trace_code will report it cleanly
        return "\n__result__ = None"

    # 1. Look for class definitions (e.g. LeetCode Solution class)
    classes = [n for n in tree.body if isinstance(n, ast.ClassDef)]
    if classes:
        cls = classes[0]
        methods = [
            m for m in cls.body
            if isinstance(m, ast.FunctionDef) and not m.name.startswith("__")
        ]
        if not methods:
            methods = [m for m in cls.body if isinstance(m, ast.FunctionDef)]

        if methods:
            # Score method by parameter match with inputs
            def method_score(m: ast.FunctionDef) -> tuple[int, int]:
                p_names = {a.arg for a in m.args.args if a.arg != "self"}
                return (len(p_names & input_keys), len(p_names))

            best_method = max(methods, key=method_score)
            params = [a.arg for a in best_method.args.args if a.arg != "self"]
            args = [
                f"__copy__.deepcopy(__inputs__[{repr(p)}])" if p in inputs else "None"
                for p in params
            ]
            return f"\n__inst = {cls.name}()\n__result__ = __inst.{best_method.name}({', '.join(args)})"
        return "\n__result__ = None"

    # 2. Look for top-level function definitions
    funcs = [
        n for n in tree.body
        if isinstance(n, ast.FunctionDef) and not n.name.startswith("__")
    ]
    if funcs:
        def func_score(f: ast.FunctionDef) -> tuple[int, int]:
            p_names = {a.arg for a in f.args.args}
            return (len(p_names & input_keys), len(p_names))

        best_func = max(funcs, key=func_score)
        params = [a.arg for a in best_func.args.args]
        args = [
            f"__copy__.deepcopy(__inputs__[{repr(p)}])" if p in inputs else "None"
            for p in params
        ]
        return f"\n__result__ = {best_func.name}({', '.join(args)})"

    # 3. Top-level script without functions
    return "\n__result__ = None"


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
        if name.startswith("__"):
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
