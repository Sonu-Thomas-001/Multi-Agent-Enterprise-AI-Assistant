import sqlite3
from sqlalchemy.orm import Session
from app.db.session import engine, Base
from app.models.database import ChatMessageModel, DepartmentBudgetModel, ExpenseModel
from app.core.config import Settings, get_settings
from app.utils.logger import logger

class DatabaseService:
    """
    Service layer for relational database operations and synthetic financial data management.
    """
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()

    def init_db(self) -> None:
        """
        Creates all tables and seeds initial synthetic enterprise database records.
        """
        Base.metadata.create_all(bind=engine)
        self._seed_financial_data()
        logger.info("SQLite relational database initialized & seeded.")

    def _seed_financial_data(self) -> None:
        db_path = self.settings.absolute_sqlite_db_path
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Check if already seeded
        cursor.execute("SELECT COUNT(*) FROM department_budgets")
        count = cursor.fetchone()[0]
        if count == 0:
            budgets = [
                ("Marketing", 250000, 300000, 200000, 400000, 2024),
                ("Engineering", 500000, 550000, 550000, 600000, 2024),
                ("HR", 100000, 100000, 120000, 120000, 2024),
                ("Sales", 300000, 350000, 400000, 500000, 2024),
            ]
            cursor.executemany(
                "INSERT INTO department_budgets (department, q1_budget, q2_budget, q3_budget, q4_budget, year) VALUES (?, ?, ?, ?, ?, ?)",
                budgets
            )

            expenses = [
                ("Marketing", "Software", 15000, "2024-01-15"),
                ("Engineering", "Cloud Services", 120000, "2024-02-10"),
                ("HR", "Recruiting Event", 5000, "2024-03-20"),
                ("Sales", "Travel", 25000, "2024-04-05"),
            ]
            cursor.executemany(
                "INSERT INTO expenses (department, category, amount, date) VALUES (?, ?, ?, ?)",
                expenses
            )

            conn.commit()
        conn.close()

    def execute_raw_sql(self, sql_query: str) -> str:
        """
        Executes a raw SQL query safely against SQLite for the Finance agent tool.
        """
        db_path = self.settings.absolute_sqlite_db_path
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute(sql_query)
            results = cursor.fetchall()
            conn.close()
            if not results:
                return "No records found for query."
            return str(results)
        except Exception as e:
            logger.error(f"SQL Execution Error: {str(e)}")
            return f"Error executing query: {str(e)}"

    def save_chat_message(self, db: Session, session_id: str, role: str, content: str, agent_used: str | None = None) -> ChatMessageModel:
        message = ChatMessageModel(
            session_id=session_id,
            role=role,
            content=content,
            agent_used=agent_used
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        return message

    def get_chat_history(self, db: Session, session_id: str) -> list[ChatMessageModel]:
        return db.query(ChatMessageModel).filter(ChatMessageModel.session_id == session_id).order_by(ChatMessageModel.created_at.asc()).all()

    def check_health(self) -> bool:
        try:
            db_path = self.settings.absolute_sqlite_db_path
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            conn.close()
            return True
        except Exception:
            return False
