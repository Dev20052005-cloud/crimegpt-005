import os
import sqlite3
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "crimes.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS crimes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            crime_type TEXT NOT NULL,
            crime_date TEXT NOT NULL,
            location TEXT NOT NULL,
            victim TEXT,
            suspect TEXT,
            description TEXT NOT NULL,
            officer_id TEXT,
            status TEXT NOT NULL,
            notes TEXT,
            created_at TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


app = Flask(__name__)
CORS(app)  # allow calls from your HTML/JS (file:// or http://localhost)

init_db()


@app.get("/api/crimes")
def list_crimes():
    conn = get_db_connection()
    rows = conn.execute(
        "SELECT * FROM crimes ORDER BY datetime(crime_date) DESC, id DESC"
    ).fetchall()
    conn.close()
    crimes = [dict(row) for row in rows]
    return jsonify(crimes)


@app.post("/api/crimes")
def create_crime():
    data = request.get_json(silent=True) or {}

    required_fields = ["crime_type", "crime_date", "location", "description", "status"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return (
            jsonify({"error": "Missing required fields", "missing": missing}),
            400,
        )

    crime_type = data.get("crime_type")
    crime_date = data.get("crime_date")
    location = data.get("location")
    victim = data.get("victim") or None
    suspect = data.get("suspect") or None
    description = data.get("description")
    officer_id = data.get("officer_id") or None
    status = data.get("status")
    notes = data.get("notes") or None
    created_at = datetime.utcnow().isoformat(timespec="seconds")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO crimes (
            crime_type, crime_date, location, victim, suspect,
            description, officer_id, status, notes, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            crime_type,
            crime_date,
            location,
            victim,
            suspect,
            description,
            officer_id,
            status,
            notes,
            created_at,
        ),
    )
    conn.commit()
    new_id = cur.lastrowid
    row = conn.execute("SELECT * FROM crimes WHERE id = ?", (new_id,)).fetchone()
    conn.close()

    return jsonify(dict(row)), 201


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    # Run on http://127.0.0.1:5000
    app.run(debug=True)
