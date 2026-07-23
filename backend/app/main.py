import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from flask import Flask, request, jsonify
from flask_cors import CORS
from a2wsgi import WSGIMiddleware

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from app.agents.graph import graph
from langchain_core.messages import HumanMessage

# 1. Initialize Flask App
flask_app = Flask(__name__)
# Allow CORS for the frontend on Flask
CORS(flask_app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Flask Route (Synchronous LangGraph processing)
@flask_app.route("/api/v1/chat/invoke", methods=["POST"])
def chat_invoke():
    try:
        data = request.json
        if not data or "message" not in data or "session_id" not in data:
            return jsonify({"error": "Missing message or session_id in request"}), 400
            
        session_id = data["session_id"]
        message = data["message"]
        
        inputs = {"messages": [HumanMessage(content=message)]}
        # Run the graph
        config = {"configurable": {"thread_id": session_id}}
        
        # Invoke LangGraph
        result = graph.invoke(inputs, config=config)
        
        # Get the final message content
        final_message = result["messages"][-1].content
        
        return jsonify({
            "response": final_message,
            "agent_used": "LangGraph Supervisor",
            "sources": []
        })
    except Exception as e:
        return jsonify({
            "response": f"An error occurred: {str(e)}",
            "agent_used": "Error",
            "sources": []
        })

# 2. Initialize FastAPI App
app = FastAPI(
    title="Multi-Agent Enterprise AI Assistant",
    description="Hybrid API using FastAPI and Flask.",
    version="1.0.0",
)

# Allow CORS for the frontend on FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# FastAPI Route (Async health check)
@app.get("/api/v1/system/status")
async def get_status():
    return {"status": "ok", "message": "System is operational (FastAPI)"}

# 3. Mount Flask inside FastAPI
# We mount the flask_app as a WSGI middleware.
# Because the frontend makes requests to /api/v1/chat/invoke, we will mount it at the root 
# so the Flask routes match exactly, or handle it as a fallback.
app.mount("/", WSGIMiddleware(flask_app))

