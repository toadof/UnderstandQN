from pydantic import BaseModel, Field
from typing import Any, Optional


class TraceRequest(BaseModel):
    """Request model for POST /trace"""
    code: str = Field(..., description="Python DSA code to trace")
    inputs: dict[str, Any] = Field(
        ...,
        description="Input variables as key-value pairs",
        examples=[{"nums": [2, 7, 11, 15], "target": 9}],
    )


class TraceStep(BaseModel):
    """A single execution step"""
    line: int = Field(..., description="Line number executed")
    lineText: str = Field(default="", description="Source text of the executed line")
    vars: dict[str, Any] = Field(
        ..., description="Variable snapshots at this line"
    )
    added: list[str] = Field(default_factory=list, description="Variables newly created this step")
    changed: list[str] = Field(default_factory=list, description="Variables whose values changed")
    removed: list[str] = Field(default_factory=list, description="Variables that went out of scope")
    callStack: list[str] = Field(default_factory=list, description="Function call stack")
    isResult: bool = Field(default=False, description="Whether this is the final return step")
    isError: bool = Field(default=False, description="Whether this is an error step")


class TraceResponse(BaseModel):
    """Response model for POST /trace"""
    total: int = Field(..., description="Total number of steps")
    steps: list[TraceStep] = Field(..., description="Execution steps")
    codeLines: list[str] = Field(default_factory=list, description="Lines of the original code")
