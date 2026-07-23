from fastapi import APIRouter, Depends, status
from app.schemas.rag import RAGSearchRequest, RAGSearchResponse
from app.services.rag_service import RAGService

router = APIRouter(prefix="/rag", tags=["Enterprise RAG Pipeline"])

def get_rag_service() -> RAGService:
    return RAGService()

@router.post(
    "/search",
    response_model=RAGSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute Hybrid RAG Search with Citations"
)
async def search_rag(
    request: RAGSearchRequest,
    rag_service: RAGService = Depends(get_rag_service)
) -> RAGSearchResponse:
    """
    Performs hybrid BM25 + dense vector similarity search with Reciprocal Rank Fusion (RRF),
    returning formatted citations, text snippets, and relevance scores.
    """
    return rag_service.search(
        query=request.query,
        domain_filter=request.domain_filter,
        top_k=request.top_k
    )
