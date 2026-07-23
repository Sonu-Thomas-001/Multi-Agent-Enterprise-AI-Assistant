from pydantic import BaseModel, Field
from langchain_core.tools import tool

class DraftEmailInput(BaseModel):
    recipient: str = Field(description="Recipient email address or department")
    subject: str = Field(description="Email subject line")
    body: str = Field(description="Formatted email body text")

@tool("draft_corporate_email", args_schema=DraftEmailInput)
def draft_corporate_email(recipient: str, subject: str, body: str) -> str:
    """
    Drafts a corporate email communication ready for executive review.
    """
    return (
        f"--- DRAFT EMAIL ---\n"
        f"To: {recipient}\n"
        f"Subject: {subject}\n\n"
        f"{body}\n"
        f"--------------------"
    )
