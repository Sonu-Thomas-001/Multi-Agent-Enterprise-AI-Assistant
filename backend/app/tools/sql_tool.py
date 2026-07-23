from typing import Any
from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.db_service import DatabaseService

class SQLQueryInput(BaseModel):
    query: str = Field(
        ...,
        description="SQL SELECT query to execute against enterprise database (tables: employees, projects, department_budgets, expenses)",
        example="SELECT department, COUNT(*) as count, AVG(salary) as avg_salary FROM employees GROUP BY department"
    )

class SQLQueryOutput(BaseModel):
    query: str
    row_count: int
    rows: list[dict[str, Any]]
    status: str = "success"
    error: str | None = None

@tool("sql_tool", args_schema=SQLQueryInput)
def sql_tool(query: str) -> str:
    """
    Executes read-only SQL queries against the corporate SQLite database (employees, projects, department_budgets, expenses).
    """
    clean_sql = query.strip()
    if not clean_sql.upper().startswith("SELECT"):
        output = SQLQueryOutput(
            query=clean_sql,
            row_count=0,
            rows=[],
            status="error",
            error="Only SELECT queries are allowed for security."
        )
        return output.model_dump_json()

    try:
        db = DatabaseService()
        rows = db.execute_read_query(clean_sql)
        output = SQLQueryOutput(
            query=clean_sql,
            row_count=len(rows),
            rows=rows[:100]  # Cap at 100 rows
        )
        return output.model_dump_json()
    except Exception as e:
        output = SQLQueryOutput(
            query=clean_sql,
            row_count=0,
            rows=[],
            status="error",
            error=str(e)
        )
        return output.model_dump_json()
