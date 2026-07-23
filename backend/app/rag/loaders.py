import os
from langchain_community.document_loaders import TextLoader, PyPDFLoader, CSVLoader, JSONLoader
from langchain_core.documents import Document
from app.utils.logger import logger

class UniversalDocumentLoader:
    """
    Universal Document Loader supporting Markdown (.md), PDF (.pdf), CSV (.csv), and JSON (.json).
    """
    @staticmethod
    def load_file(file_path: str) -> list[Document]:
        if not os.path.exists(file_path):
            logger.error(f"File not found: '{file_path}'")
            return []

        ext = os.path.splitext(file_path)[1].lower()
        try:
            if ext == ".md" or ext == ".txt":
                loader = TextLoader(file_path, encoding="utf-8")
                return loader.load()
            elif ext == ".pdf":
                loader = PyPDFLoader(file_path)
                return loader.load()
            elif ext == ".csv":
                loader = CSVLoader(file_path, encoding="utf-8")
                return loader.load()
            elif ext == ".json":
                loader = JSONLoader(file_path, jq_schema=".", text_content=False)
                return loader.load()
            else:
                logger.warning(f"Unsupported file extension '{ext}' for file '{file_path}'. Falling back to TextLoader.")
                return TextLoader(file_path, encoding="utf-8").load()
        except Exception as e:
            logger.error(f"Error loading document '{file_path}': {str(e)}", exc_info=True)
            return []
