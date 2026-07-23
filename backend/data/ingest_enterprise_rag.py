import os
import glob
import sqlite3

# Import ChromaDB and services
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

from app.services.vector_service import VectorDBService
from app.services.db_service import DatabaseService
from app.core.config import get_settings
from app.utils.logger import logger

settings = get_settings()
BASE_DATA_DIR = os.path.dirname(os.path.abspath(__file__))
DOCUMENTS_DIR = os.path.join(BASE_DATA_DIR, "documents")
SQL_DIR = os.path.join(BASE_DATA_DIR, "sql")

def ingest_structured_sqlite():
    logger.info("Ingesting SQLite database schema & synthetic enterprise tables...")
    db_service = DatabaseService(settings=settings)
    db_service.init_db()

    sql_file = os.path.join(SQL_DIR, "enterprise_schema.sql")
    if os.path.exists(sql_file):
        conn = sqlite3.connect(settings.absolute_sqlite_db_path)
        cursor = conn.cursor()
        with open(sql_file, "r", encoding="utf-8") as f:
            sql_script = f.read()
        cursor.executescript(sql_script)
        conn.commit()
        conn.close()
        logger.info("Executed enterprise_schema.sql successfully. Employees & Projects tables ready.")

def ingest_unstructured_chroma():
    logger.info("Ingesting 200 Markdown & PDF documents into ChromaDB vector store...")
    vector_service = VectorDBService(settings=settings)
    collection = vector_service.get_collection("enterprise_docs")

    md_files = glob.glob(os.path.join(DOCUMENTS_DIR, "**/*.md"), recursive=True)
    logger.info(f"Found {len(md_files)} Markdown files for vector indexing.")

    ids = []
    documents = []
    metadatas = []

    for idx, filepath in enumerate(md_files, 1):
        rel_dir = os.path.basename(os.path.dirname(filepath))
        filename = os.path.basename(filepath)
        doc_id = f"doc_{idx}_{filename.replace('.md', '')}"

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Extract domain
        domain = "HR" if "hr" in rel_dir else ("IT" if "it" in rel_dir or "incident" in rel_dir or "engineering" in rel_dir else "GENERAL")
        
        ids.append(doc_id)
        documents.append(content)
        metadatas.append({
            "domain": domain,
            "category": rel_dir,
            "title": filename,
            "source_file": filepath
        })

    # Batch upsert into ChromaDB
    batch_size = 50
    for i in range(0, len(ids), batch_size):
        collection.upsert(
            ids=ids[i:i+batch_size],
            documents=documents[i:i+batch_size],
            metadatas=metadatas[i:i+batch_size]
        )

    logger.info(f"Successfully ingested {len(ids)} documents into ChromaDB 'enterprise_docs' collection.")

if __name__ == "__main__":
    ingest_structured_sqlite()
    ingest_unstructured_chroma()
