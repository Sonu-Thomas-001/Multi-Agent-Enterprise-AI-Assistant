from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.db_service import DatabaseService

class QuerySQLAnalyticsInput(BaseModel):
    sql_query: str = Field(description="SQL query to execute against department_budgets or expenses tables")

@tool("query_financial_sql", args_schema=QuerySQLAnalyticsInput)
def query_financial_sql(sql_query: str) -> str:
    """
    Executes raw SQL queries against SQLite database containing financial metrics.
    Tables: department_budgets (department, q1_budget, q2_budget, q3_budget, q4_budget, year)
    expenses (department, category, amount, date)
    """
    db_service = DatabaseService()
    return db_service.execute_raw_sql(sql_query)
