from langchain_core.embeddings import Embeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from app.core.config import Settings, get_settings
from app.utils.logger import logger

class EmbeddingFactory:
    """
    Factory for producing LangChain Embeddings model based on application settings.
    """
    @staticmethod
    def get_embeddings(settings: Settings | None = None) -> Embeddings:
        settings = settings or get_settings()
        provider = settings.LLM_PROVIDER.lower()

        if provider == "google" and settings.GOOGLE_API_KEY:
            return GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=settings.GOOGLE_API_KEY
            )
        elif provider == "openai" and settings.OPENAI_API_KEY:
            return OpenAIEmbeddings(
                model="text-embedding-3-small",
                api_key=settings.OPENAI_API_KEY
            )
        else:
            # Zero-cost, high performance local embeddings fallback
            logger.info("Using HuggingFace 'all-MiniLM-L6-v2' local embedding model.")
            return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
