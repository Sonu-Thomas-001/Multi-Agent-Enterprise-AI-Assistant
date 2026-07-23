from typing import Any
from langchain_core.documents import Document
from langchain_community.retrievers import BM25Retriever
from app.rag.vectorstore import LangChainVectorStore
from app.utils.logger import logger

class HybridSearchRetriever:
    """
    Enterprise Hybrid Search Retriever combining BM25 Keyword Search and ChromaDB Dense Vector Search
    fused using Reciprocal Rank Fusion (RRF).
    """
    def __init__(self, vectorstore: LangChainVectorStore | None = None) -> None:
        self.vectorstore = vectorstore or LangChainVectorStore()

    def reciprocal_rank_fusion(self, results_lists: list[list[Document]], k: int = 60) -> list[tuple[Document, float]]:
        """
        Reciprocal Rank Fusion (RRF) algorithm to combine multiple ranked lists.
        RRF_Score(d) = sum(1 / (k + rank(d)))
        """
        rrf_scores: dict[str, float] = {}
        doc_map: dict[str, Document] = {}

        for results in results_lists:
            for rank, doc in enumerate(results, start=1):
                doc_key = doc.page_content[:200]  # Key by text preview
                doc_map[doc_key] = doc
                if doc_key not in rrf_scores:
                    rrf_scores[doc_key] = 0.0
                rrf_scores[doc_key] += 1.0 / (k + rank)

        # Sort documents by accumulated RRF score in descending order
        sorted_keys = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)
        return [(doc_map[key], round(rrf_scores[key], 4)) for key in sorted_keys]

    def hybrid_search(self, query: str, top_k: int = 4, domain_filter: str | None = None) -> list[tuple[Document, float]]:
        """
        Executes Dense Vector Similarity Search and Sparse BM25 Keyword Search concurrently,
        and fuses results with RRF.
        """
        try:
            # 1. Dense Vector Search
            dense_tuples = self.vectorstore.similarity_search_with_score(
                query=query,
                top_k=top_k * 2,
                domain_filter=domain_filter
            )
            dense_docs = [doc for doc, _ in dense_tuples]

            # 2. Sparse BM25 Search
            if dense_docs:
                bm25_retriever = BM25Retriever.from_documents(dense_docs)
                bm25_retriever.k = min(top_k * 2, len(dense_docs))
                sparse_docs = bm25_retriever.invoke(query)
            else:
                sparse_docs = []

            # 3. Fuse Results with Reciprocal Rank Fusion
            fused_results = self.reciprocal_rank_fusion([dense_docs, sparse_docs])
            logger.info(f"Hybrid RRF Search retrieved {len(fused_results[:top_k])} documents for query '{query}'.")
            return fused_results[:top_k]
        except Exception as e:
            logger.error(f"Hybrid search execution error for query '{query}': {str(e)}", exc_info=True)
            return []
