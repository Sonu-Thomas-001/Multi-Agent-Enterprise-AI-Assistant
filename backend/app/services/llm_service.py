from langchain_core.language_models.chat_models import BaseChatModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from app.core.config import Settings, get_settings
from app.utils.logger import logger

class LLMService:
    """
    LLM Factory & Management Service.
    Instantiates LangChain chat models dynamically based on environment settings.
    """
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    def get_llm(self) -> BaseChatModel:
        provider = self.settings.LLM_PROVIDER.lower()
        model_name = self.settings.LLM_MODEL
        temperature = self.settings.LLM_TEMPERATURE

        if provider == "gemini":
            api_key = self.settings.GOOGLE_API_KEY
            if not api_key:
                logger.warning("GOOGLE_API_KEY is not set in environment settings.")
            return ChatGoogleGenerativeAI(
                model=model_name or "gemini-1.5-pro",
                temperature=temperature,
                google_api_key=api_key
            )
        elif provider == "openai":
            api_key = self.settings.OPENAI_API_KEY
            if not api_key:
                logger.warning("OPENAI_API_KEY is not set in environment settings.")
            return ChatOpenAI(
                model=model_name or "gpt-4o",
                temperature=temperature,
                api_key=api_key
            )
        else:
            raise ValueError(f"Unsupported LLM Provider: '{provider}'")

    def is_configured(self) -> bool:
        if self.settings.LLM_PROVIDER == "gemini":
            return bool(self.settings.GOOGLE_API_KEY)
        elif self.settings.LLM_PROVIDER == "openai":
            return bool(self.settings.OPENAI_API_KEY)
        return False
