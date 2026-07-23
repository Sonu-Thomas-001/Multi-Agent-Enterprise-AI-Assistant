import chromadb
import os

CHROMA_DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/chroma"))
os.makedirs(CHROMA_DB_DIR, exist_ok=True)

def get_chroma_client():
    return chromadb.PersistentClient(path=CHROMA_DB_DIR)

def get_collection(collection_name: str = "enterprise_docs"):
    client = get_chroma_client()
    return client.get_or_create_collection(name=collection_name)
