from app.rag.retriever import HybridSearchRetriever
from app.rag.citation import CitationExtractor
from app.rag.memory import EnterpriseConversationMemory
from app.schemas.rag import RAGSearchResponse, CitationHighlightSchema
from app.core.config import Settings, get_settings
from app.utils.logger import logger

class RAGService:
    """
    Enterprise RAG Service orchestrating hybrid search, citation extraction, and conversation memory.
    """
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.retriever = HybridSearchRetriever()
        self.citation_extractor = CitationExtractor()
        self.memory = EnterpriseConversationMemory()

    def search(self, query: str, domain_filter: str | None = None, top_k: int = 4) -> RAGSearchResponse:
        logger.info(f"Executing RAG hybrid search: query='{query}', domain='{domain_filter}', top_k={top_k}")
        
        # 1. Execute Hybrid Search (Vector + BM25 with RRF)
        retrieved_tuples = self.retriever.hybrid_search(
            query=query,
            top_k=top_k,
            domain_filter=domain_filter
        )

        # 2. Extract Citations & Highlight Snippets
        citations = self.citation_extractor.extract_citations(retrieved_tuples)

        return RAGSearchResponse(
            query=query,
            total_results=len(citations),
            citations=citations
        )
