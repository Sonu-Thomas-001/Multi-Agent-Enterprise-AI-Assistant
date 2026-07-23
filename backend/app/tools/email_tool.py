import uuid
from pydantic import BaseModel, Field
from langchain_core.tools import tool

class EmailInput(BaseModel):
    recipient_email: str = Field(..., description="Recipient email address", example="taylor.rodriguez@acmedigital.com")
    subject: str = Field(..., description="Email subject line", example="Quarterly Budget Review Update")
    body: str = Field(..., description="Email content body", example="Hello Taylor,\n\nPlease find attached the Q3 budget summary.")
    cc: list[str] | None = Field(default=None, description="Optional CC recipient emails")

class EmailOutput(BaseModel):
    message_id: str
    recipient_email: str
    subject: str
    status: str = "sent"
    timestamp: str

@tool("send_email", args_schema=EmailInput)
def email_tool(recipient_email: str, subject: str, body: str, cc: list[str] | None = None) -> str:
    """
    Composes and dispatches internal corporate emails to Acme Digital Solutions team members.
    """
    msg_id = f"MSG-{uuid.uuid4().hex[:8].upper()}"
    output = EmailOutput(
        message_id=msg_id,
        recipient_email=recipient_email,
        subject=subject,
        status="queued_for_delivery",
        timestamp="2026-07-23T22:18:00Z"
    )
    return output.model_dump_json()
