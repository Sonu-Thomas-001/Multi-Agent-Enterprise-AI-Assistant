from typing import Any
from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.services.db_service import DatabaseService

class ProjectSearchInput(BaseModel):
    query: str = Field(..., description="Project name, status, tech stack, or lead email to search", example="Cloud Migration")
    status_filter: str | None = Field(default=None, description="Optional status filter (e.g. In Progress, Completed, Planning, On Hold)")

class ProjectRecord(BaseModel):
    id: int
    project_name: str
    lead_email: str
    budget: float
    status: str
    tech_stack: str
    start_date: str
    end_date: str

class ProjectSearchOutput(BaseModel):
    query: str
    total_found: int
    projects: list[ProjectRecord]
    error: str | None = None

@tool("project_search", args_schema=ProjectSearchInput)
def project_search_tool(query: str, status_filter: str | None = None) -> str:
    """
    Searches corporate engineering & enterprise projects (50 projects) by project name, tech stack, or lead.
    """
    try:
        db = DatabaseService()
        sql = "SELECT id, project_name, lead_email, budget, status, tech_stack, start_date, end_date FROM projects WHERE (project_name LIKE ? OR tech_stack LIKE ? OR lead_email LIKE ?)"
        params: list[Any] = [f"%{query}%", f"%{query}%", f"%{query}%"]
        
        if status_filter:
            sql += " AND status = ?"
            params.append(status_filter)
            
        sql += " LIMIT 20"
        rows = db.execute_read_query(sql, tuple(params))
        
        records = [
            ProjectRecord(
                id=r["id"],
                project_name=r["project_name"],
                lead_email=r["lead_email"],
                budget=float(r["budget"]),
                status=r["status"],
                tech_stack=r["tech_stack"],
                start_date=str(r["start_date"]),
                end_date=str(r["end_date"])
            ) for r in rows
        ]
        
        output = ProjectSearchOutput(query=query, total_found=len(records), projects=records)
        return output.model_dump_json()
    except Exception as e:
        output = ProjectSearchOutput(query=query, total_found=0, projects=[], error=str(e))
        return output.model_dump_json()
