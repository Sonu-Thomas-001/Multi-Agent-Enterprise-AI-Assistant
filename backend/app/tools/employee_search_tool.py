from typing import Any
from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.db_service import DatabaseService

class EmployeeSearchInput(BaseModel):
    query: str = Field(..., description="Employee name, department, role, or email to search", example="Engineering")
    department: str | None = Field(default=None, description="Optional department filter (e.g. Engineering, Sales, HR, Finance)")

class EmployeeRecord(BaseModel):
    id: int
    name: str
    email: str
    department: str
    role: str
    salary: float
    hire_date: str

class EmployeeSearchOutput(BaseModel):
    query: str
    total_found: int
    employees: list[EmployeeRecord]
    error: str | None = None

@tool("employee_search", args_schema=EmployeeSearchInput)
def employee_search_tool(query: str, department: str | None = None) -> str:
    """
    Searches the Acme Digital Solutions employee database (100 employees) by name, department, or role.
    """
    try:
        db = DatabaseService()
        sql = "SELECT id, name, email, department, role, salary, hire_date FROM employees WHERE (name LIKE ? OR role LIKE ? OR department LIKE ? OR email LIKE ?)"
        params: list[Any] = [f"%{query}%", f"%{query}%", f"%{query}%", f"%{query}%"]
        
        if department:
            sql += " AND department = ?"
            params.append(department)
        
        sql += " LIMIT 20"
        rows = db.execute_read_query(sql, tuple(params))
        
        records = [
            EmployeeRecord(
                id=r["id"],
                name=r["name"],
                email=r["email"],
                department=r["department"],
                role=r["role"],
                salary=float(r["salary"]),
                hire_date=str(r["hire_date"])
            ) for r in rows
        ]
        
        output = EmployeeSearchOutput(query=query, total_found=len(records), employees=records)
        return output.model_dump_json()
    except Exception as e:
        output = EmployeeSearchOutput(query=query, total_found=0, employees=[], error=str(e))
        return output.model_dump_json()
