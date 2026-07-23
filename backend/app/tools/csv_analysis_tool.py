import os
from typing import Any
import pandas as pd
from pydantic import BaseModel, Field
from langchain_core.tools import tool
from app.core.config import get_settings

class CSVAnalysisInput(BaseModel):
    dataset_name: str = Field(..., description="CSV dataset to analyze ('employees' or 'projects')", example="employees")
    operation: str = Field(default="summary", description="Analysis operation ('summary', 'head', 'department_stats', 'budget_stats')")

class CSVAnalysisOutput(BaseModel):
    dataset_name: str
    row_count: int
    column_names: list[str]
    summary_data: list[dict[str, Any]] | dict[str, Any]
    status: str = "success"
    error: str | None = None

@tool("csv_analysis", args_schema=CSVAnalysisInput)
def csv_analysis_tool(dataset_name: str, operation: str = "summary") -> str:
    """
    Performs data analysis and statistics over structured corporate CSV datasets (employees.csv, projects.csv).
    """
    settings = get_settings()
    base_dir = os.path.join(settings.absolute_chroma_dir, "..", "structured")
    
    file_map = {
        "employees": os.path.join(base_dir, "employees.csv"),
        "projects": os.path.join(base_dir, "projects.csv")
    }
    
    clean_name = dataset_name.lower().strip()
    if clean_name not in file_map:
        output = CSVAnalysisOutput(
            dataset_name=dataset_name,
            row_count=0,
            column_names=[],
            summary_data={},
            status="error",
            error=f"Dataset '{dataset_name}' not found. Available datasets: 'employees', 'projects'."
        )
        return output.model_dump_json()

    csv_path = os.path.abspath(file_map[clean_name])
    if not os.path.exists(csv_path):
        output = CSVAnalysisOutput(
            dataset_name=dataset_name,
            row_count=0,
            column_names=[],
            summary_data={},
            status="error",
            error=f"CSV file not found at path '{csv_path}'."
        )
        return output.model_dump_json()

    try:
        df = pd.read_csv(csv_path)
        col_names = list(df.columns)
        
        if operation == "head":
            res_data = df.head(5).to_dict(orient="records")
        elif operation == "department_stats" and "department" in df.columns:
            res_data = df.groupby("department")["salary"].agg(["count", "mean", "min", "max"]).reset_index().to_dict(orient="records")
        elif operation == "budget_stats" and "budget" in df.columns:
            res_data = df.groupby("status")["budget"].agg(["count", "sum", "mean"]).reset_index().to_dict(orient="records")
        else:
            # General summary stats
            res_data = {
                "total_rows": len(df),
                "numeric_describe": df.describe().to_dict()
            }

        output = CSVAnalysisOutput(
            dataset_name=clean_name,
            row_count=len(df),
            column_names=col_names,
            summary_data=res_data
        )
        return output.model_dump_json()
    except Exception as e:
        output = CSVAnalysisOutput(
            dataset_name=dataset_name,
            row_count=0,
            column_names=[],
            summary_data={},
            status="error",
            error=str(e)
        )
        return output.model_dump_json()
