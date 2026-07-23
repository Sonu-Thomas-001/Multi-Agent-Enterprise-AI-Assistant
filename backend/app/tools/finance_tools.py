from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.db_service import DatabaseService

class QueryFinanceDBInput(BaseModel):
    sql_query: str = Field(description="Valid SQLite query to run against department_budgets or expenses tables")

@tool("query_financial_database", args_schema=QueryFinanceDBInput)
def query_financial_database(sql_query: str) -> str:
    """
    Executes a SQL query against the SQLite database containing financial data.
    Tables: department_budgets (department, q1_budget, q2_budget, q3_budget, q4_budget, year)
    expenses (department, category, amount, date)
    """
    db_service = DatabaseService()
    return db_service.execute_raw_sql(sql_query)
