"""Dependency-free daily Panchang overview (not muhurta-grade ephemeris)."""
from __future__ import annotations

from datetime import date, datetime
import math

TITHIS = ["Shukla Pratipada","Shukla Dwitiya","Shukla Tritiya","Shukla Chaturthi","Shukla Panchami","Shukla Shashthi","Shukla Saptami","Shukla Ashtami","Shukla Navami","Shukla Dashami","Shukla Ekadashi","Shukla Dwadashi","Shukla Trayodashi","Shukla Chaturdashi","Purnima","Krishna Pratipada","Krishna Dwitiya","Krishna Tritiya","Krishna Chaturthi","Krishna Panchami","Krishna Shashthi","Krishna Saptami","Krishna Ashtami","Krishna Navami","Krishna Dashami","Krishna Ekadashi","Krishna Dwadashi","Krishna Trayodashi","Krishna Chaturdashi","Amavasya"]
NAKSHATRAS = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"]
YOGAS = ["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyana","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"]


def daily_panchang(day: str, lat: float = 20.5937, lon: float = 78.9629) -> dict:
    current = datetime.strptime(day, "%Y-%m-%d").date()
    epoch = date(2000, 1, 6)
    days = (current - epoch).days + 0.5 - lon / 360.0
    lunation = (days / 29.530588853) % 1
    tithi_index = int(lunation * 30) % 30
    moon_cycle = (days / 27.321661) % 1
    nakshatra_index = int(moon_cycle * 27) % 27
    yoga_index = int(((days / 365.25636 + moon_cycle) % 1) * 27) % 27
    daylight = 12 + 1.8 * math.sin(2 * math.pi * (current.timetuple().tm_yday - 80) / 365) * math.cos(math.radians(lat))
    sunrise_hour = 12 - daylight / 2
    sunset_hour = 12 + daylight / 2
    fmt = lambda value: f"{int(value):02d}:{int((value % 1) * 60):02d}"
    return {
        "date": day, "tithi": TITHIS[tithi_index], "nakshatra": NAKSHATRAS[nakshatra_index],
        "yoga": YOGAS[yoga_index], "karana": ["Bava","Balava","Kaulava","Taitila","Garaja","Vanija","Vishti"][tithi_index % 7],
        "sunrise": fmt(sunrise_hour), "sunset": fmt(sunset_hour), "latitude": lat, "longitude": lon,
        "precision": "Educational daily overview; consult a regional Panchang for muhurta or boundary times.",
    }
