import os
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from app.core.config import Settings, get_settings
from app.rag.embeddings import EmbeddingFactory
from app.utils.logger import logger

class LangChainVectorStore:
    """
    Wrapper for LangChain Chroma VectorStore integration.
    """
    def __init__(self, collection_name: str = "enterprise_docs", settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.collection_name = collection_name
        self.persist_dir = self.settings.absolute_chroma_dir
        os.makedirs(self.persist_dir, exist_ok=True)
        self.embeddings = EmbeddingFactory.get_embeddings(settings=self.settings)
        self._store: Chroma | None = None

    @property
    def store(self) -> Chroma:
        if self._store is None:
            self._store = Chroma(
                collection_name=self.collection_name,
                embedding_function=self.embeddings,
                persist_directory=self.persist_dir
            )
        return self._store

    def add_documents(self, documents: list[Document]) -> list[str]:
        if not documents:
            return []
        ids = self.store.add_documents(documents)
        logger.info(f"Added {len(documents)} document chunks to ChromaDB collection '{self.collection_name}'.")
        return ids

    def similarity_search_with_score(self, query: str, top_k: int = 4, domain_filter: str | None = None) -> list[tuple[Document, float]]:
        filter_dict = {"domain": domain_filter} if domain_filter else None
        return self.store.similarity_search_with_score(
            query=query,
            k=top_k,
            filter=filter_dict
        )
