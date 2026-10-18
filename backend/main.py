from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import TraceRequest, TraceResponse, TraceStep
from tracer import trace_code

app = FastAPI(
    title="UnderstoodQN",
    description="DSA Algorithm Execution Visualizer",
    version="1.0.0",
)

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "UnderstoodQN",
        "description": "Paste any DSA solution, tag your variables, provide a test case — and see execution animated step by step.",
        "version": "1.0.0",
        "endpoints": {
            "POST /trace": "Trace Python code execution line by line",
            "GET /health": "Health check",
        },
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/trace", response_model=TraceResponse)
async def trace_endpoint(request: TraceRequest):
    """
    Execute user-submitted Python code with provided inputs.
    Returns step-by-step execution trace with variable snapshots.
    """
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")

    if not request.inputs:
        raise HTTPException(status_code=400, detail="Inputs cannot be empty")

    try:
        result = trace_code(request.code, request.inputs)
        return TraceResponse(
            total=result["total"],
            steps=[
                TraceStep(
                    line=s["line"],
                    lineText=s.get("lineText", ""),
                    vars=s["vars"],
                    added=s.get("added", []),
                    changed=s.get("changed", []),
                    removed=s.get("removed", []),
                    callStack=s.get("callStack", []),
                    isResult=s.get("isResult", False),
                    isError=s.get("isError", False),
                )
                for s in result["steps"]
            ],
            codeLines=result.get("codeLines", []),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
