import math
import ast
from pydantic import BaseModel, Field
from langchain_core.tools import tool

class CalculatorInput(BaseModel):
    expression: str = Field(
        ...,
        description="Mathematical arithmetic expression to evaluate (e.g. '150 * 1.18 + (4500 / 12)')",
        example="125000 * 0.15"
    )

class CalculatorOutput(BaseModel):
    expression: str
    result: float
    status: str = "success"
    error: str | None = None

class SafeMathEvaluator(ast.NodeVisitor):
    ALLOWED_NODES = (
        ast.Expression, ast.BinOp, ast.UnaryOp, ast.Num, ast.Constant,
        ast.Add, ast.Sub, ast.Mult, ast.Div, ast.FloorDiv, ast.Mod, ast.Pow,
        ast.USub, ast.UAdd
    )

    def visit(self, node: ast.AST):
        if not isinstance(node, self.ALLOWED_NODES):
            raise ValueError(f"Unsupported mathematical operation: {type(node).__name__}")
        return super().visit(node)

@tool("calculator", args_schema=CalculatorInput)
def calculator_tool(expression: str) -> str:
    """
    Performs safe mathematical and arithmetic calculations for financial budgets, percentages, and metrics.
    """
    try:
        clean_expr = expression.replace(",", "").strip()
        tree = ast.parse(clean_expr, mode='eval')
        evaluator = SafeMathEvaluator()
        evaluator.visit(tree)
        
        compiled = compile(tree, filename="<ast>", mode="eval")
        result_val = float(eval(compiled, {"__builtins__": None, "math": math}))
        
        output = CalculatorOutput(expression=clean_expr, result=round(result_val, 4))
        return output.model_dump_json()
    except Exception as e:
        output = CalculatorOutput(expression=expression, result=0.0, status="error", error=str(e))
        return output.model_dump_json()
