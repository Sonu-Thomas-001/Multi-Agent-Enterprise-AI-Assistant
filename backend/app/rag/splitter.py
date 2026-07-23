import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

class MetadataAwareTextSplitter:
    """
    Configurable text splitter preserving source path, category, title, and line offset metadata.
    """
    def __init__(self, chunk_size: int = 600, chunk_overlap: int = 100) -> None:
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )

    def split_documents(self, documents: list[Document]) -> list[Document]:
        chunks = self.splitter.split_documents(documents)
        for idx, chunk in enumerate(chunks):
            source = chunk.metadata.get("source", "unknown")
            filename = os.path.basename(source)
            category = os.path.basename(os.path.dirname(source))
            
            chunk.metadata.update({
                "chunk_index": idx,
                "title": filename,
                "category": category,
                "domain": "HR" if "hr" in category.lower() else ("IT" if "it" in category.lower() or "incident" in category.lower() else "GENERAL")
            })
        return chunks
