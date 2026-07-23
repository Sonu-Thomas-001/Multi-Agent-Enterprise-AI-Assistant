import os
import chromadb
from chromadb.api import ClientAPI
from chromadb.api.models.Collection import Collection
from app.core.config import Settings, get_settings
from app.utils.logger import logger

class VectorDBService:
    """
    Service wrapper for ChromaDB vector operations and document management.
    """
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.persist_dir = self.settings.absolute_chroma_dir
        os.makedirs(self.persist_dir, exist_ok=True)
        self._client: ClientAPI | None = None

    @property
    def client(self) -> ClientAPI:
        if self._client is None:
            self._client = chromadb.PersistentClient(path=self.persist_dir)
        return self._client

    def get_collection(self, name: str = "enterprise_docs") -> Collection:
        return self.client.get_or_create_collection(name=name)

    def search_documents(
        self,
        query: str,
        collection_name: str = "enterprise_docs",
        domain_filter: str | None = None,
        top_k: int = 2
    ) -> list[str]:
        """
        Queries ChromaDB collection using similarity search with optional metadata filtering.
        """
        try:
            collection = self.get_collection(collection_name)
            where_clause = {"domain": domain_filter} if domain_filter else None
            
            results = collection.query(
                query_texts=[query],
                n_results=top_k,
                where=where_clause
            )
            
            documents = results.get("documents", [[]])[0]
            return documents
        except Exception as e:
            logger.error(f"Vector search failed in collection '{collection_name}': {str(e)}")
            return []

    def seed_initial_docs(self, collection_name: str = "enterprise_docs") -> None:
        """
        Populates vector database with synthetic HR and IT enterprise documents.
        """
        docs = [
            {
                "id": "hr_doc_1",
                "text": "Employee Remote Work Policy: Employees are allowed to work remotely up to 3 days a week. Mondays and Wednesdays are mandatory in-office days. For fully remote roles, employees must be online during core hours of 10 AM to 3 PM EST.",
                "metadata": {"domain": "HR", "type": "Policy", "title": "Remote Work Policy"}
            },
            {
                "id": "hr_doc_2",
                "text": "Health Benefits 2024: The company offers Premium Health, Dental, and Vision insurance. The company covers 80% of the premium for employees and 50% for dependents. Open enrollment is in November.",
                "metadata": {"domain": "HR", "type": "Benefits", "title": "Health Benefits 2024"}
            },
            {
                "id": "it_doc_1",
                "text": "VPN Troubleshooting Guide: If you cannot connect to the corporate VPN, first ensure your internet connection is stable. Then, restart the Cisco AnyConnect client. If the issue persists, open a ticket at helpdesk.corp.com or ask the IT Assistant.",
                "metadata": {"domain": "IT", "type": "Guide", "title": "VPN Troubleshooting"}
            },
            {
                "id": "it_doc_2",
                "text": "Password Reset Protocol: Passwords must be at least 14 characters long and include a mix of uppercase, lowercase, numbers, and symbols. Passwords expire every 90 days. To reset, go to sso.corp.com/reset.",
                "metadata": {"domain": "IT", "type": "Policy", "title": "Password Reset Protocol"}
            }
        ]

        collection = self.get_collection(collection_name)
        collection.upsert(
            ids=[d["id"] for d in docs],
            documents=[d["text"] for d in docs],
            metadatas=[d["metadata"] for d in docs]
        )
        logger.info("ChromaDB synthetic vector documents initialized/updated.")

    def check_health((self)) -> bool:
        try:
            self.client.heartbeat()
            return True
        except Exception:
            return False
