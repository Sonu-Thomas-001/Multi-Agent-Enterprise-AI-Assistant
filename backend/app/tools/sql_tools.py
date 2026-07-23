from langchain_core.tools import tool
import sqlite3
import os

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/enterprise.db"))

@tool
def query_financial_database(query: str) -> str:
    """
    Executes a SQL query against the SQLite database containing financial data.
    The database has two tables: 
    1. department_budgets (id, department, q1_budget, q2_budget, q3_budget, q4_budget, year)
    2. expenses (id, department, category, amount, date)
    
    Use this tool to answer questions about budgets and expenses.
    Return the query results as a string.
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(query)
        results = cursor.fetchall()
        conn.close()
        
        if not results:
            return "No results found for the query."
        return str(results)
    except Exception as e:
        return f"Error executing query: {str(e)}"
