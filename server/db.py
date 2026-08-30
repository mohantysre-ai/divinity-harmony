"""Small persistent store for profiles, favorites, japa and directory data."""
from __future__ import annotations

import os
import sqlite3
from urllib.parse import quote, quote_plus
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = os.environ.get("DH_DB_PATH", "/data/divinity-harmony.db")


def _path() -> str:
    path = Path(DB_PATH)
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.touch(exist_ok=True)
        return str(path)
    except OSError:
        fallback = Path("/tmp/divinity-harmony.db")
        fallback.touch(exist_ok=True)
        return str(fallback)


def connect() -> sqlite3.Connection:
    connection = sqlite3.connect(_path(), timeout=10)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with connect() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS profiles (
          device_id TEXT PRIMARY KEY, name TEXT DEFAULT '', gotra TEXT DEFAULT '',
          language TEXT DEFAULT 'en', updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS favorites (
          device_id TEXT NOT NULL, resource_type TEXT NOT NULL, resource_id TEXT NOT NULL,
          created_at TEXT NOT NULL, PRIMARY KEY(device_id, resource_type, resource_id)
        );
        CREATE TABLE IF NOT EXISTS japa_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT, device_id TEXT NOT NULL, mantra_id TEXT NOT NULL,
          count INTEGER NOT NULL, session_date TEXT NOT NULL, updated_at TEXT NOT NULL,
          UNIQUE(device_id, mantra_id, session_date)
        );
        CREATE TABLE IF NOT EXISTS priests (
          id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, state TEXT NOT NULL,
          languages TEXT NOT NULL, services TEXT NOT NULL, contact TEXT DEFAULT '', verified INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS explain_cache (
          cache_key TEXT PRIMARY KEY, response TEXT NOT NULL, updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
          email TEXT PRIMARY KEY, status TEXT NOT NULL DEFAULT 'active',
          consent_at TEXT NOT NULL, source TEXT NOT NULL DEFAULT 'website'
        );
        """)
        db.executemany(
            "INSERT OR IGNORE INTO priests(id,name,city,state,languages,services,verified) VALUES(?,?,?,?,?,?,1)",
            [
                (1, "Pandit & Acharya Search", "Varanasi", "Uttar Pradesh", "Hindi,Sanskrit", "Griha Pravesh,Satyanarayan Puja,Shraddha"),
                (2, "Vedic Priest Search", "Bengaluru", "Karnataka", "Kannada,Telugu,Hindi,Sanskrit", "Ganesha Puja,Navagraha Homa,Wedding rituals"),
                (3, "Temple Priest Search", "Bhubaneswar", "Odisha", "Odia,Hindi,Sanskrit", "Jagannath Puja,Griha Pravesh,Ancestral rites"),
                (4, "Pandit & Puja Service Search", "Mumbai", "Maharashtra", "Marathi,Hindi,Sanskrit", "Satyanarayan Puja,Vastu Puja,Marriage rituals"),
                (5, "Pandit & Puja Service Search", "Delhi", "Delhi", "Hindi,Sanskrit,Punjabi", "Griha Pravesh,Wedding rituals,Navagraha Puja"),
                (6, "Vedic Priest Search", "Hyderabad", "Telangana", "Telugu,Hindi,Sanskrit", "Satyanarayan Puja,Homam,Namakarana"),
                (7, "Vadhyar & Priest Search", "Chennai", "Tamil Nadu", "Tamil,Sanskrit,Telugu", "Ganapathi Homam,Ayush Homam,Wedding rituals"),
                (8, "Pandit & Puja Service Search", "Kolkata", "West Bengal", "Bengali,Hindi,Sanskrit", "Durga Puja,Lakshmi Puja,Griha Pravesh"),
                (9, "Pandit & Puja Service Search", "Pune", "Maharashtra", "Marathi,Hindi,Sanskrit", "Satyanarayan Puja,Vastu Shanti,Marriage rituals"),
                (10, "Vedic Priest Search", "Ahmedabad", "Gujarat", "Gujarati,Hindi,Sanskrit", "Griha Pravesh,Satyanarayan Puja,Havan"),
                (11, "Pandit & Puja Service Search", "Jaipur", "Rajasthan", "Hindi,Sanskrit,Rajasthani", "Griha Pravesh,Wedding rituals,Havan"),
                (12, "Purohit & Puja Service Search", "Puri", "Odisha", "Odia,Hindi,Sanskrit", "Jagannath Puja,Shraddha,Ancestral rites"),
            ],
        )


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_profile(device_id: str) -> dict:
    with connect() as db:
        row = db.execute("SELECT * FROM profiles WHERE device_id=?", (device_id,)).fetchone()
    return dict(row) if row else {"device_id": device_id, "name": "", "gotra": "", "language": "en"}


def save_profile(device_id: str, payload: dict) -> dict:
    with connect() as db:
        db.execute("""INSERT INTO profiles(device_id,name,gotra,language,updated_at) VALUES(?,?,?,?,?)
          ON CONFLICT(device_id) DO UPDATE SET name=excluded.name,gotra=excluded.gotra,
          language=excluded.language,updated_at=excluded.updated_at""",
          (device_id, str(payload.get("name", ""))[:80], str(payload.get("gotra", ""))[:80], str(payload.get("language", "en"))[:12], now()))
    return get_profile(device_id)


def save_japa(device_id: str, mantra_id: str, count: int, session_date: str) -> dict:
    safe_count = max(0, min(int(count), 1000000))
    with connect() as db:
        db.execute("""INSERT INTO japa_sessions(device_id,mantra_id,count,session_date,updated_at) VALUES(?,?,?,?,?)
          ON CONFLICT(device_id,mantra_id,session_date) DO UPDATE SET count=excluded.count,updated_at=excluded.updated_at""",
          (device_id, mantra_id[:80], safe_count, session_date[:10], now()))
        rows = db.execute("SELECT mantra_id,count,session_date FROM japa_sessions WHERE device_id=? ORDER BY session_date DESC LIMIT 100", (device_id,)).fetchall()
    return {"sessions": [dict(row) for row in rows]}


def list_favorites(device_id: str) -> list[dict]:
    with connect() as db:
        rows = db.execute("SELECT resource_type,resource_id,created_at FROM favorites WHERE device_id=? ORDER BY created_at DESC", (device_id,)).fetchall()
    return [dict(row) for row in rows]


def set_favorite(device_id: str, resource_type: str, resource_id: str, active: bool) -> list[dict]:
    with connect() as db:
        if active:
            db.execute("INSERT OR IGNORE INTO favorites(device_id,resource_type,resource_id,created_at) VALUES(?,?,?,?)", (device_id, resource_type[:30], resource_id[:80], now()))
        else:
            db.execute("DELETE FROM favorites WHERE device_id=? AND resource_type=? AND resource_id=?", (device_id, resource_type[:30], resource_id[:80]))
    return list_favorites(device_id)


def list_priests() -> list[dict]:
    with connect() as db:
        rows = db.execute("SELECT * FROM priests WHERE verified=1 ORDER BY state,city,name").fetchall()
    items = []
    for row in rows:
        query = f"pandit priest puja services {row['city']} {row['state']}"
        city_path = quote(row["city"].replace(" ", "-"), safe="-")
        items.append({
            **dict(row),
            "languages": row["languages"].split(","),
            "services": row["services"].split(","),
            "google_maps_url": f"https://www.google.com/maps/search/?api=1&query={quote_plus(query)}",
            "google_search_url": f"https://www.google.com/search?q={quote_plus(query + ' contact phone')}",
            "sulekha_url": f"https://www.sulekha.com/priests-purohits/{city_path.lower()}",
        })
    return items


def cached_explanation(key: str) -> str | None:
    with connect() as db:
        row = db.execute("SELECT response FROM explain_cache WHERE cache_key=?", (key,)).fetchone()
    return row[0] if row else None


def cache_explanation(key: str, response: str) -> None:
    with connect() as db:
        db.execute("INSERT OR REPLACE INTO explain_cache(cache_key,response,updated_at) VALUES(?,?,?)", (key, response, now()))


def subscribe_newsletter(email: str) -> dict:
    normalized = email.strip().lower()
    with connect() as db:
        existing = db.execute("SELECT status FROM newsletter_subscribers WHERE email=?", (normalized,)).fetchone()
        db.execute(
            """INSERT INTO newsletter_subscribers(email,status,consent_at,source) VALUES(?,?,?,?)
               ON CONFLICT(email) DO UPDATE SET status='active',consent_at=excluded.consent_at""",
            (normalized, "active", now(), "website"),
        )
    return {"subscribed": True, "alreadySubscribed": bool(existing and existing["status"] == "active")}
