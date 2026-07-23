import sqlite3
import os
import sys

# Add backend to path to import db config if needed
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
from app.db.vectorstore import get_collection

DB_PATH = os.path.join(os.path.dirname(__file__), "enterprise.db")

def seed_sqlite():
    print("Seeding SQLite database (Finance data)...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS department_budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            department TEXT NOT NULL,
            q1_budget INTEGER,
            q2_budget INTEGER,
            q3_budget INTEGER,
            q4_budget INTEGER,
            year INTEGER
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            department TEXT NOT NULL,
            category TEXT NOT NULL,
            amount INTEGER,
            date TEXT
        )
    """)

    # Clear existing data
    cursor.execute("DELETE FROM department_budgets")
    cursor.execute("DELETE FROM expenses")

    # Insert mock data
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
    print("SQLite seeding completed.")

def seed_chroma():
    print("Seeding ChromaDB (HR and IT docs)...")
    collection = get_collection("enterprise_docs")
    
    docs = [
        # HR Documents
        {
            "id": "hr_doc_1",
            "text": "Employee Remote Work Policy: Employees are allowed to work remotely up to 3 days a week. Mondays and Wednesdays are mandatory in-office days. For fully remote roles, employees must be online during core hours of 10 AM to 3 PM EST.",
            "metadata": {"domain": "HR", "type": "Policy", "title": "Remote Work Policy"}
        },
        {
            "id": "hr_doc_2",
            "text": "Health Benefits 2024: The company offers Premium Health, Dental, and Vision insurance. The company covers 80% of the premium for employees and 50% for dependents. Open enrollment is in November.",
            "metadata": {"domain": "HR", "type": "Benefits", "title": "Health Benefits 2024"}
        },
        # IT Documents
        {
            "id": "it_doc_1",
            "text": "VPN Troubleshooting Guide: If you cannot connect to the corporate VPN, first ensure your internet connection is stable. Then, restart the Cisco AnyConnect client. If the issue persists, open a ticket at helpdesk.corp.com or ask the IT Assistant.",
            "metadata": {"domain": "IT", "type": "Guide", "title": "VPN Troubleshooting"}
        },
        {
            "id": "it_doc_2",
            "text": "Password Reset Protocol: Passwords must be at least 14 characters long and include a mix of uppercase, lowercase, numbers, and symbols. Passwords expire every 90 days. To reset, go to sso.corp.com/reset.",
            "metadata": {"domain": "IT", "type": "Policy", "title": "Password Reset Protocol"}
        }
    ]

    # Delete existing if any to avoid duplicates in this POC script
    # We will just add/upsert
    collection.upsert(
        ids=[doc["id"] for doc in docs],
        documents=[doc["text"] for doc in docs],
        metadatas=[doc["metadata"] for doc in docs]
    )
    print("ChromaDB seeding completed.")

if __name__ == "__main__":
    seed_sqlite()
    seed_chroma()
