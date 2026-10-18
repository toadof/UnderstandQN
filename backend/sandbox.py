import sys
import io
import contextlib
from typing import Any


def execute_sandboxed(code: str, inputs: dict[str, Any]) -> dict:
    """
    Execute user code in a sandboxed environment using RestrictedPython.
    Falls back to restricted builtins if RestrictedPython is unavailable.
    """
    try:
        from RestrictedPython import compile_restricted, safe_globals
        return _execute_with_restricted(code, inputs, safe_globals)
    except ImportError:
        return _execute_with_safe_builtins(code, inputs)


def _execute_with_restricted(code: str, inputs: dict, safe_globals: dict) -> dict:
    """Execute using RestrictedPython for maximum safety."""
    from RestrictedPython import compile_restricted
    from RestrictedPython.Guards import safe_builtins

    try:
        compiled = compile_restricted(code, "<user_code>", "exec")
        exec_globals = {
            **safe_globals,
            "__builtins__": safe_builtins,
            **inputs,
        }
        local_vars: dict[str, Any] = {}
        exec(compiled, exec_globals, local_vars)
        return {"success": True, "locals": local_vars}
    except Exception as e:
        return {"success": False, "error": str(e)}


def _execute_with_safe_builtins(code: str, inputs: dict) -> dict:
    """Fallback: execute with a restricted set of builtins."""
    safe_builtins = {
        "range": range,
        "len": len,
        "print": print,
        "int": int,
        "float": float,
        "str": str,
        "bool": bool,
        "list": list,
        "dict": dict,
        "set": set,
        "tuple": tuple,
        "enumerate": enumerate,
        "zip": zip,
        "map": map,
        "filter": filter,
        "sorted": sorted,
        "reversed": reversed,
        "min": min,
        "max": max,
        "sum": sum,
        "abs": abs,
        "any": any,
        "all": all,
        "isinstance": isinstance,
        "type": type,
        "True": True,
        "False": False,
        "None": None,
        "__import__": None,  # Block imports
    }

    try:
        compiled = compile(code, "<user_code>", "exec")
        exec_globals: dict[str, Any] = {
            "__builtins__": safe_builtins,
            **inputs,
        }
        local_vars: dict[str, Any] = {}
        exec(compiled, exec_globals, local_vars)
        return {"success": True, "locals": local_vars}
    except Exception as e:
        return {"success": False, "error": str(e)}
