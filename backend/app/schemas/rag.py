from pydantic import BaseModel, Field

class CitationHighlightSchema(BaseModel):
    source_file: str = Field(description="Absolute or relative path of the source document")
    title: str = Field(description="Document title")
    category: str = Field(description="Enterprise document category (HR, IT, Engineering, etc.)")
    domain: str = Field(description="High level domain classification")
    page_or_section: str = Field(default="N/A", description="Page number or section header")
    score: float = Field(default=0.0, description="RRF or similarity relevance score")
    snippet: str = Field(description="Highlighted exact text snippet from source")

class RAGSearchRequest(BaseModel):
    query: str = Field(..., min_length=2, description="Search query string", example="What is the remote work policy?")
    domain_filter: str | None = Field(default=None, description="Optional domain filter (HR, IT, Engineering)")
    top_k: int = Field(default=4, ge=1, le=10, description="Number of hybrid documents to retrieve")

class RAGSearchResponse(BaseModel):
    query: str
    total_results: int
    citations: list[CitationHighlightSchema]
