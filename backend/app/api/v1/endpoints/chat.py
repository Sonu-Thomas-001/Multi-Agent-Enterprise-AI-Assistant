import time
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.chat import ChatMessageRequest, ChatMessageResponse, ChatHistoryResponse, MessageItemSchema
from app.api.deps import get_db_session, get_db_service
from app.services.db_service import DatabaseService
from app.agents.graph import run_agent_workflow
from app.utils.logger import logger

router = APIRouter(prefix="/chat", tags=["Chat Agent Engine"])

@router.post(
    "/invoke",
    response_model=ChatMessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Invoke Multi-Agent Network"
)
async def invoke_chat(
    request: ChatMessageRequest,
    db: Session = Depends(get_db_session),
    db_service: DatabaseService = Depends(get_db_service)
) -> ChatMessageResponse:
    """
    Submits user message to the LangGraph supervisor network.
    Executes supervisor routing, executes tool call nodes, persists history, and returns structured agent output.
    """
    start_time = time.time()
    try:
        # Save user message to persistent SQL database
        db_service.save_chat_message(
            db=db,
            session_id=request.session_id,
            role="user",
            content=request.message
        )

        # Run multi-agent orchestration graph
        agent_result = run_agent_workflow(
            message=request.message,
            session_id=request.session_id
        )

        response_content = agent_result.get("response", "No response generated.")
        agent_name = agent_result.get("agent_used", "Supervisor")

        # Save assistant response to persistent SQL database
        db_service.save_chat_message(
            db=db,
            session_id=request.session_id,
            role="assistant",
            content=response_content,
            agent_used=agent_name
        )

        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return ChatMessageResponse(
            session_id=request.session_id,
            response=response_content,
            agent_used=agent_name,
            sources=[],
            execution_time_ms=elapsed_ms
        )
    except Exception as e:
        logger.error(f"Error invoking chat agent workflow: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent workflow execution error: {str(e)}"
        )


@router.get(
    "/history/{session_id}",
    response_model=ChatHistoryResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch Persistent Chat Session History"
)
async def get_history(
    session_id: str,
    db: Session = Depends(get_db_session),
    db_service: DatabaseService = Depends(get_db_service)
) -> ChatHistoryResponse:
    """
    Retrieves all historic messages associated with a session UUID.
    """
    messages = db_service.get_chat_history(db=db, session_id=session_id)
    serialized_messages = [MessageItemSchema.model_validate(msg) for msg in messages]

    return ChatHistoryResponse(
        session_id=session_id,
        total_messages=len(serialized_messages),
        messages=serialized_messages
    )
