"""Swiss Ephemeris Vedic birth chart (Lahiri ayanamsa, whole-sign houses)."""
from __future__ import annotations

from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from panchang import NAKSHATRAS, RASHIS, TITHIS, YOGAS

try:
    import swisseph as swe
    from timezonefinder import TimezoneFinder

    _TF = TimezoneFinder()
    EPHEMERIS_AVAILABLE = True
    GRAHA_IDS = (
        ("Sun", swe.SUN),
        ("Moon", swe.MOON),
        ("Mars", swe.MARS),
        ("Mercury", swe.MERCURY),
        ("Jupiter", swe.JUPITER),
        ("Venus", swe.VENUS),
        ("Saturn", swe.SATURN),
        ("Rahu", swe.MEAN_NODE),
    )
except ImportError:
    swe = None  # type: ignore[assignment]
    _TF = None
    EPHEMERIS_AVAILABLE = False
    GRAHA_IDS = ()

DASHA_LORDS = [
    "Ketu",
    "Venus",
    "Sun",
    "Moon",
    "Mars",
    "Rahu",
    "Jupiter",
    "Saturn",
    "Mercury",
]
DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]
KARANAS = [
    "Bava",
    "Balava",
    "Kaulava",
    "Taitila",
    "Garaja",
    "Vanija",
    "Vishti",
    "Shakuni",
    "Chatushpada",
    "Naga",
    "Kimstughna",
]


def _parse_time(birth_time: str) -> tuple[int, int, int]:
    parts = birth_time.split(":")
    hour = int(parts[0])
    minute = int(parts[1]) if len(parts) > 1 else 0
    second = int(parts[2]) if len(parts) > 2 else 0
    return hour, minute, second


def _timezone_name(lat: float, lon: float, tz_override: str | None) -> str:
    if tz_override:
        return tz_override
    if _TF is None:
        raise RuntimeError("timezonefinder is not installed")
    name = _TF.timezone_at(lat=lat, lng=lon)
    if not name:
        raise ValueError("Could not resolve timezone for coordinates.")
    return name


def _julian_day_ut(
    birth_date: str,
    birth_time: str,
    lat: float,
    lon: float,
    tz_name: str | None = None,
) -> tuple[float, str]:
    year, month, day = (int(part) for part in birth_date.split("-"))
    hour, minute, second = _parse_time(birth_time)
    tz = ZoneInfo(_timezone_name(lat, lon, tz_name))
    local = datetime(year, month, day, hour, minute, second, tzinfo=tz)
    utc = local.astimezone(timezone.utc)
    ut_hours = (
        utc.hour + utc.minute / 60.0 + utc.second / 3600.0 + utc.microsecond / 3_600_000_000.0
    )
    jd = swe.julday(utc.year, utc.month, utc.day, ut_hours)
    return jd, str(tz)


def _norm360(value: float) -> float:
    return value % 360.0


def _rashi_index(longitude: float) -> int:
    return int(_norm360(longitude) / 30.0) % 12


def _nakshatra_index(longitude: float) -> int:
    return int(_norm360(longitude) / (360.0 / 27.0)) % 27


def _nakshatra_pada(longitude: float) -> int:
    span = 360.0 / 27.0
    remainder = _norm360(longitude) % span
    return int(remainder / (span / 4.0)) + 1


def _tithi_index(sun_long: float, moon_long: float) -> int:
    elongation = _norm360(moon_long - sun_long)
    index = int(elongation / 12.0)
    if index >= 30:
        index = 29
    return index


def _yoga_index(sun_long: float, moon_long: float) -> int:
    total = _norm360(sun_long + moon_long)
    return int(total / (360.0 / 27.0)) % 27


def _whole_sign_house(planet_rashi: int, lagna_rashi: int) -> int:
    return (planet_rashi - lagna_rashi) % 12 + 1


def _vimshottari_balance(moon_long: float) -> dict:
    nak_idx = _nakshatra_index(moon_long)
    lord_idx = nak_idx % 9
    span = 360.0 / 27.0
    traveled = _norm360(moon_long) % span
    remaining = 1.0 - traveled / span
    balance_years = remaining * DASHA_YEARS[lord_idx]
    return {
        "mahadasha": DASHA_LORDS[lord_idx],
        "mahadasha_index": lord_idx,
        "balance_years": round(balance_years, 4),
        "balance_days": round(balance_years * 365.25, 1),
    }


def _vimshottari_current(
    birth_date: str,
    birth_time: str,
    lat: float,
    lon: float,
    moon_long: float,
    tz_name: str | None = None,
) -> dict:
    birth = _vimshottari_balance(moon_long)
    start_idx = birth["mahadasha_index"]
    remaining = birth["balance_years"]

    year, month, day = (int(part) for part in birth_date.split("-"))
    hour, minute, second = _parse_time(birth_time)
    tz = ZoneInfo(_timezone_name(lat, lon, tz_name))
    birth_dt = datetime(year, month, day, hour, minute, second, tzinfo=tz)
    now = datetime.now(tz)
    elapsed_years = (now - birth_dt).total_seconds() / (365.25 * 86400.0)

    idx = start_idx
    left = remaining
    while elapsed_years > left:
        elapsed_years -= left
        idx = (idx + 1) % 9
        left = DASHA_YEARS[idx]

    return {
        "current_mahadasha": DASHA_LORDS[idx],
        "current_mahadasha_index": idx,
        "years_remaining": round(left - elapsed_years, 4),
    }


def _sidereal_longitude(jd: float, body: int) -> float:
    flags = swe.FLG_SIDEREAL | swe.FLG_SWIEPH
    pos, _ = swe.calc_ut(jd, body, flags)
    return _norm360(pos[0])


def birth_chart(
    birth_date: str,
    birth_time: str,
    lat: float = 20.5937,
    lon: float = 78.9629,
    tz_name: str | None = None,
) -> dict:
    if not EPHEMERIS_AVAILABLE:
        raise RuntimeError("Swiss Ephemeris is not installed on this server.")

    swe.set_sid_mode(swe.SIDM_LAHIRI)
    jd, tz_resolved = _julian_day_ut(birth_date, birth_time, lat, lon, tz_name)
    flags = swe.FLG_SIDEREAL | swe.FLG_SWIEPH

    sun_long = _sidereal_longitude(jd, swe.SUN)
    moon_long = _sidereal_longitude(jd, swe.MOON)
    _, ascmc = swe.houses_ex(jd, lat, lon, b"W", flags)
    lagna_long = _norm360(ascmc[0])

    moon_rashi = _rashi_index(moon_long)
    lagna_rashi = _rashi_index(lagna_long)
    nak_idx = _nakshatra_index(moon_long)
    tithi_idx = _tithi_index(sun_long, moon_long)
    yoga_idx = _yoga_index(sun_long, moon_long)

    planets: list[dict] = []
    for name, body_id in GRAHA_IDS:
        long_val = _sidereal_longitude(jd, body_id)
        rashi_idx = _rashi_index(long_val)
        planets.append(
            {
                "name": name,
                "longitude": round(long_val, 4),
                "rashi": RASHIS[rashi_idx],
                "rashi_index": rashi_idx,
                "nakshatra": NAKSHATRAS[_nakshatra_index(long_val)],
                "nakshatra_index": _nakshatra_index(long_val),
                "pada": _nakshatra_pada(long_val),
                "house": _whole_sign_house(rashi_idx, lagna_rashi),
                "retrograde": bool(swe.calc_ut(jd, body_id, flags)[0][3] < 0),
            }
        )

    rahu_long = _sidereal_longitude(jd, swe.MEAN_NODE)
    ketu_long = _norm360(rahu_long + 180.0)
    ketu_rashi = _rashi_index(ketu_long)
    planets.append(
        {
            "name": "Ketu",
            "longitude": round(ketu_long, 4),
            "rashi": RASHIS[ketu_rashi],
            "rashi_index": ketu_rashi,
            "nakshatra": NAKSHATRAS[_nakshatra_index(ketu_long)],
            "nakshatra_index": _nakshatra_index(ketu_long),
            "pada": _nakshatra_pada(ketu_long),
            "house": _whole_sign_house(ketu_rashi, lagna_rashi),
            "retrograde": True,
        }
    )

    dasha_birth = _vimshottari_balance(moon_long)
    dasha_current = _vimshottari_current(
        birth_date, birth_time, lat, lon, moon_long, tz_name
    )

    return {
        "birth_date": birth_date,
        "birth_time": birth_time,
        "latitude": lat,
        "longitude": lon,
        "timezone": tz_resolved,
        "ayanamsha": "Lahiri",
        "house_system": "Whole sign",
        "rashi": RASHIS[moon_rashi],
        "rashi_index": moon_rashi,
        "sun_rashi": RASHIS[_rashi_index(sun_long)],
        "sun_rashi_index": _rashi_index(sun_long),
        "lagna": RASHIS[lagna_rashi],
        "lagna_index": lagna_rashi,
        "nakshatra": NAKSHATRAS[nak_idx],
        "nakshatra_index": nak_idx,
        "nakshatra_pada": _nakshatra_pada(moon_long),
        "tithi": TITHIS[tithi_idx],
        "tithi_index": tithi_idx,
        "yoga": YOGAS[yoga_idx],
        "yoga_index": yoga_idx,
        "karana": KARANAS[tithi_idx % 7],
        "paksha": "Shukla Paksha" if tithi_idx < 15 else "Krishna Paksha",
        "planets": planets,
        "dasha_at_birth": dasha_birth,
        "dasha_current": dasha_current,
        "precision": (
            "Swiss Ephemeris sidereal chart (Lahiri ayanamsha, whole-sign houses). "
            "Matches standard Panchang software methodology; confirm muhurta boundaries locally."
        ),
        "engine": "swisseph",
    }
