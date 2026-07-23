import os
import json
import csv
import random
from datetime import datetime, timedelta
from fpdf import FPDF

# Seed for reproducibility
random.seed(42)

BASE_DATA_DIR = os.path.dirname(os.path.abspath(__file__))
STRUCTURED_DIR = os.path.join(BASE_DATA_DIR, "structured")
DOCUMENTS_DIR = os.path.join(BASE_DATA_DIR, "documents")
SQL_DIR = os.path.join(BASE_DATA_DIR, "sql")

os.makedirs(STRUCTURED_DIR, exist_ok=True)
os.makedirs(DOCUMENTS_DIR, exist_ok=True)
os.makedirs(SQL_DIR, exist_ok=True)

COMPANY_NAME = "Acme Digital Solutions"

DEPARTMENTS = ["Engineering", "HR", "Finance", "Sales", "Marketing", "IT Support", "Legal", "Product"]
ROLES = {
    "Engineering": ["Senior Software Engineer", "DevOps Engineer", "Frontend Developer", "Backend Lead", "QA Specialist"],
    "HR": ["HR Manager", "Recruiter", "People Ops Lead", "HR Coordinator"],
    "Finance": ["Financial Analyst", "Controller", "Payroll Specialist", "CFO"],
    "Sales": ["Account Executive", "Sales Manager", "BDR", "VP Sales"],
    "Marketing": ["Marketing Manager", "Content Specialist", "SEO Lead", "CMO"],
    "IT Support": ["IT Helpdesk Specialist", "Systems Administrator", "Network Engineer"],
    "Legal": ["Corporate Counsel", "Compliance Officer"],
    "Product": ["Product Manager", "UI/UX Designer", "Scrum Master"]
}

FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Riley", "Casey", "Jamie", "Dakota", "Reese", "Quinn", "Avery", "Peyton", "Skyler", "Cameron", "Rowan", "Hayden", "Emerson"]
LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"]

# 1. Generate 100 Employees
print("Generating 100 Employee records...")
employees = []
for i in range(1, 101):
    fname = random.choice(FIRST_NAMES)
    lname = random.choice(LAST_NAMES)
    dept = random.choice(DEPARTMENTS)
    role = random.choice(ROLES[dept])
    email = f"{fname.lower()}.{lname.lower()}{i}@acmedigital.com"
    salary = random.randint(65000, 195000)
    hire_date = (datetime.now() - timedelta(days=random.randint(30, 1800))).strftime("%Y-%m-%d")
    
    employees.append({
        "employee_id": f"EMP-{1000 + i}",
        "first_name": fname,
        "last_name": lname,
        "email": email,
        "department": dept,
        "role": role,
        "salary": salary,
        "hire_date": hire_date
    })

# Save CSV & JSON
with open(os.path.join(STRUCTURED_DIR, "employees.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=employees[0].keys())
    writer.writeheader()
    writer.writerows(employees)

with open(os.path.join(STRUCTURED_DIR, "employees.json"), "w", encoding="utf-8") as f:
    json.dump(employees, f, indent=2)

# 2. Generate 50 Projects
print("Generating 50 Project records...")
PROJECT_PREFIXES = ["Titan", "Apollo", "Phoenix", "Nexus", "Vanguard", "Genesis", "Horizon", "Velocity", "Quantum", "Cyber"]
PROJECT_TYPES = ["Cloud Migration", "AI Assistant", "CRM Integration", "Security Audit", "ERP Upgrade", "Mobile App", "Analytics Pipeline"]
TECH_STACKS = ["Python, FastAPI, LangGraph, React", "Java, Spring Boot, PostgreSQL", "Node.js, Next.js, MongoDB", "Go, Kubernetes, Microservices", "Python, PyTorch, ChromaDB"]

projects = []
for i in range(1, 51):
    pname = f"Project {random.choice(PROJECT_PREFIXES)} {random.choice(PROJECT_TYPES)}"
    lead = random.choice(employees)["email"]
    budget = random.randint(50000, 750000)
    status = random.choice(["Planning", "In Progress", "Testing", "Completed", "On Hold"])
    tech = random.choice(TECH_STACKS)
    start_date = (datetime.now() - timedelta(days=random.randint(60, 365))).strftime("%Y-%m-%d")
    end_date = (datetime.now() + timedelta(days=random.randint(30, 200))).strftime("%Y-%m-%d")
    
    projects.append({
        "project_id": f"PRJ-{2000 + i}",
        "project_name": pname,
        "lead_email": lead,
        "budget": budget,
        "status": status,
        "tech_stack": tech,
        "start_date": start_date,
        "end_date": end_date
    })

with open(os.path.join(STRUCTURED_DIR, "projects.csv"), "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=projects[0].keys())
    writer.writeheader()
    writer.writerows(projects)

with open(os.path.join(STRUCTURED_DIR, "projects.json"), "w", encoding="utf-8") as f:
    json.dump(projects, f, indent=2)

# 3. PDF Generator Helper
class SimplePDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 12)
        self.cell(0, 10, f"{COMPANY_NAME} - Enterprise Document", border=False, new_x="LMARGIN", new_y="NEXT", align="C")
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}", border=False, new_x="LMARGIN", new_y="NEXT", align="C")

def create_pdf(file_path: str, title: str, content: str):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 14)
    pdf.multi_cell(180, 8, title.encode('latin-1', 'replace').decode('latin-1'))
    pdf.ln(5)
    pdf.set_font("Helvetica", "", 10)
    
    for line in content.splitlines():
        cleaned_line = line.encode('latin-1', 'replace').decode('latin-1')
        if not cleaned_line.strip():
            pdf.ln(3)
        else:
            pdf.multi_cell(180, 6, cleaned_line)
    pdf.output(file_path)

# 4. Generate 200 Documents across 11 Categories
print("Generating 200 Documents (.md and .pdf)...")
CATEGORIES = [
    ("hr_policies", "HR Policy", 25),
    ("engineering_sops", "Engineering SOP", 35),
    ("incident_reports", "Incident Report", 25),
    ("architecture_docs", "Architecture Spec", 25),
    ("financial_reports", "Financial Report", 20),
    ("meeting_notes", "Meeting Notes", 20),
    ("email_threads", "Email Thread", 20),
    ("support_tickets", "Support Ticket", 15),
    ("change_requests", "Change Request", 15),
    ("knowledge_base", "Knowledge Base Guide", 15),
    ("product_roadmap", "Product Roadmap", 15)
]

doc_counter = 0
for cat_folder, cat_title, count in CATEGORIES:
    cat_path = os.path.join(DOCUMENTS_DIR, cat_folder)
    os.makedirs(cat_path, exist_ok=True)
    
    for j in range(1, count + 1):
        doc_counter += 1
        doc_id = f"DOC-{1000 + doc_counter}"
        title = f"{COMPANY_NAME} {cat_title} #{j}: {cat_folder.replace('_', ' ').title()}"
        
        md_content = f"""# {title}
**Document ID:** {doc_id}  
**Category:** {cat_title}  
**Date:** {(datetime.now() - timedelta(days=random.randint(1, 365))).strftime("%Y-%m-%d")}  
**Author:** {random.choice(employees)['first_name']} {random.choice(employees)['last_name']} ({random.choice(employees)['role']})  
**Classification:** Internal Enterprise Confidential  

## Overview & Context
This document details standard procedures, operational guidelines, and recorded updates for {COMPANY_NAME}. All employees must adhere to these policies and guidelines.

## Key Details
- **Primary Domain:** {cat_folder.replace('_', ' ').upper()}
- **Target Audience:** All {COMPANY_NAME} Teams & Stakeholders
- **Compliance Requirement:** Mandatory Annual Review

## Operational Content
1. **Procedure Step 1:** Verify initial environment configuration and access control parameters.
2. **Procedure Step 2:** Execute automated test validation suites before deploying changes.
3. **Procedure Step 3:** Notify departmental leads via Slack (#ops-alerts) and update JIRA ticket tracking.
4. **Procedure Step 4:** Record incident response metrics and conduct post-mortem synthesis if unexpected latency occurs.

## Contact & Support
For further clarification regarding this document, contact `support@acmedigital.com` or consult the internal IT Support Agent.
"""
        
        # Save Markdown
        md_file = os.path.join(cat_path, f"doc_{doc_counter}.md")
        with open(md_file, "w", encoding="utf-8") as f:
            f.write(md_content)
            
        # Save PDF
        pdf_file = os.path.join(cat_path, f"doc_{doc_counter}.pdf")
        create_pdf(pdf_file, title, md_content)

print(f"Generated {doc_counter} Markdown and {doc_counter} PDF document files.")

# 5. Generate SQL Dump File
print("Generating enterprise_schema.sql...")
sql_file = os.path.join(SQL_DIR, "enterprise_schema.sql")
with open(sql_file, "w", encoding="utf-8") as f:
    f.write("-- Acme Digital Solutions Enterprise SQL Dump\n\n")
    f.write("CREATE TABLE IF NOT EXISTS employees (employee_id TEXT PRIMARY KEY, first_name TEXT, last_name TEXT, email TEXT, department TEXT, role TEXT, salary INTEGER, hire_date TEXT);\n")
    f.write("CREATE TABLE IF NOT EXISTS projects (project_id TEXT PRIMARY KEY, project_name TEXT, lead_email TEXT, budget INTEGER, status TEXT, tech_stack TEXT, start_date TEXT, end_date TEXT);\n\n")
    
    for emp in employees:
        f.write(f"INSERT INTO employees VALUES ('{emp['employee_id']}', '{emp['first_name']}', '{emp['last_name']}', '{emp['email']}', '{emp['department']}', '{emp['role']}', {emp['salary']}, '{emp['hire_date']}');\n")
    
    for prj in projects:
        clean_name = prj['project_name'].replace("'", "''")
        f.write(f"INSERT INTO projects VALUES ('{prj['project_id']}', '{clean_name}', '{prj['lead_email']}', {prj['budget']}, '{prj['status']}', '{prj['tech_stack']}', '{prj['start_date']}', '{prj['end_date']}');\n")

print("Data generation script complete!")
