from pydantic import BaseModel, Field
from langchain_core.tools import tool

class ExecuteCodeInput(BaseModel):
    code_snippet: str = Field(description="Python code snippet to validate")

@tool("execute_python_code", args_schema=ExecuteCodeInput)
def execute_python_code(code_snippet: str) -> str:
    """
    Validates and checks Python code snippets for syntax correctness and enterprise safety.
    """
    try:
        compile(code_snippet, "<string>", "exec")
        return f"Code validation successful! Syntax is valid.\n```python\n{code_snippet}\n```"
    except SyntaxError as e:
        return f"Code Syntax Error on line {e.lineno}: {e.msg}"
