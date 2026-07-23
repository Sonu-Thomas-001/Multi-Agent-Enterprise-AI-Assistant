from pydantic import BaseModel, Field
from langchain_core.tools import tool

class GenerateReportInput(BaseModel):
    title: str = Field(description="Report title")
    sections: list[str] = Field(description="List of section summaries to compile into a report")

@tool("generate_markdown_report", args_schema=GenerateReportInput)
def generate_markdown_report(title: str, sections: list[str]) -> str:
    """
    Compiles multi-agent outputs into a structured executive Markdown report.
    """
    body = "\n\n".join([f"### Section {i+1}\n{sec}" for i, sec in enumerate(sections)])
    return f"# {title}\n\n{body}"
