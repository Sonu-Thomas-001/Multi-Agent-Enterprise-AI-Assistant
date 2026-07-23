from langchain_core.documents import Document
from app.schemas.rag import CitationHighlightSchema

class CitationExtractor:
    """
    Source Citation & Highlighting Engine.
    Parses RAG document chunks and formats structured citations with relevance scores.
    """
    @staticmethod
    def extract_citations(retrieved_tuples: list[tuple[Document, float]]) -> list[CitationHighlightSchema]:
        citations = []
        for doc, score in retrieved_tuples:
            metadata = doc.metadata or {}
            source_file = metadata.get("source", metadata.get("source_file", "Unknown Document"))
            title = metadata.get("title", "Enterprise Document")
            category = metadata.get("category", "General")
            domain = metadata.get("domain", "Enterprise")
            page_or_section = f"Section {metadata.get('chunk_index', 1)}"

            # Highlight snippet preview (first 250 characters)
            snippet = doc.page_content.strip()
            if len(snippet) > 250:
                snippet = snippet[:250] + "..."

            citations.append(CitationHighlightSchema(
                source_file=source_file,
                title=title,
                category=category,
                domain=domain,
                page_or_section=page_or_section,
                score=score,
                snippet=snippet
            ))
        return citations
