from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.db.session import Base

class ChatMessageModel(Base):
    """
    Persisted Chat Message history.
    """
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(64), index=True, nullable=False)
    role = Column(String(20), nullable=False)  # 'user' | 'assistant'
    content = Column(Text, nullable=False)
    agent_used = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class DepartmentBudgetModel(Base):
    """
    Synthetic Financial Data: Department Budgets.
    """
    __tablename__ = "department_budgets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    department = Column(String(50), nullable=False, index=True)
    q1_budget = Column(Integer, nullable=False)
    q2_budget = Column(Integer, nullable=False)
    q3_budget = Column(Integer, nullable=False)
    q4_budget = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False, default=2024)


class ExpenseModel(Base):
    """
    Synthetic Financial Data: Department Expenses.
    """
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    department = Column(String(50), nullable=False, index=True)
    category = Column(String(50), nullable=False)
    amount = Column(Integer, nullable=False)
    date = Column(String(20), nullable=False)
