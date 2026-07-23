import sys
import io
import math
from pydantic import BaseModel, Field
from langchain_core.tools import tool

class PythonInput(BaseModel):
    code: str = Field(..., description="Python code string to execute for calculations or data transformation", example="data = [10, 20, 30, 40]; print(sum(data) / len(data))")

class PythonExecutionOutput(BaseModel):
    code: str
    stdout: str
    return_value: str | None = None
    status: str = "success"
    error: str | None = None

@tool("python_interpreter", args_schema=PythonInput)
def python_tool(code: str) -> str:
    """
    Executes Python code snippets in a controlled environment for data transformation, math calculations, and analytics.
    """
    old_stdout = sys.stdout
    captured_stdout = io.StringIO()
    sys.stdout = captured_stdout

    try:
        global_vars = {"math": math}
        local_vars: dict[str, str] = {}
        
        exec_res = exec(code, global_vars, local_vars)
        sys.stdout = old_stdout
        
        output_str = captured_stdout.getvalue().strip()
        ret_val = str(local_vars.get("result", exec_res)) if "result" in local_vars else None
        
        output = PythonExecutionOutput(
            code=code,
            stdout=output_str,
            return_value=ret_val
        )
        return output.model_dump_json()
    except Exception as e:
        sys.stdout = old_stdout
        output = PythonExecutionOutput(
            code=code,
            stdout=captured_stdout.getvalue().strip(),
            status="error",
            error=str(e)
        )
        return output.model_dump_json()
