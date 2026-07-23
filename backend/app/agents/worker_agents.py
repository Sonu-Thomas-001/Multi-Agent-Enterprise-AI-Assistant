import os
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from dotenv import load_dotenv
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
from app.tools.sql_tools import query_financial_database
from app.tools.rag_tools import search_hr_documents, search_it_knowledge_base

load_dotenv()

# We use Gemini as requested in user settings
llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0)

# HR Agent
hr_agent = create_react_agent(
    llm,
    tools=[search_hr_documents],
    state_modifier="You are the HR Assistant. You help employees with HR questions, policies, and benefits. Always use your search tool to find the correct information."
)

# Finance Agent
finance_agent = create_react_agent(
    llm,
    tools=[query_financial_database],
    state_modifier="You are the Finance Assistant. You help users with financial questions like budgets and expenses by querying the SQLite database. Write SQL queries based on user requests."
)

# IT Support Agent
it_agent = create_react_agent(
    llm,
    tools=[search_it_knowledge_base],
    state_modifier="You are the IT Support Assistant. You help employees troubleshoot technical issues. Use your search tool to find IT guides and policies."
)
