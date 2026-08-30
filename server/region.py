"""Regional script lookup for coordinates explicitly shared by a visitor."""
from __future__ import annotations
import json, threading, time
from urllib.parse import urlencode
from urllib.request import Request, urlopen

_CACHE: dict[str, tuple[float, dict]] = {}
_LOCK = threading.Lock()
STATE_SCRIPTS = {
 "odisha":("oriya","Odia"),"telangana":("telugu","Telugu"),"andhra pradesh":("telugu","Telugu"),
 "tamil nadu":("tamil","Tamil"),"west bengal":("bengali","Bengali"),"tripura":("bengali","Bengali"),
 "gujarat":("gujarati","Gujarati"),"punjab":("gurmukhi","Punjabi"),"karnataka":("kannada","Kannada"),
 "kerala":("malayalam","Malayalam"),"maharashtra":("devanagari","Marathi"),"goa":("devanagari","Konkani"),
}

def regional_preference(lat: float, lon: float) -> dict:
 if not (-90<=lat<=90 and -180<=lon<=180): raise ValueError("Invalid coordinates")
 key=f"{lat:.2f},{lon:.2f}"; now=time.time()
 with _LOCK:
  cached=_CACHE.get(key)
  if cached and now-cached[0]<86400:return cached[1]
 params=urlencode({"format":"jsonv2","lat":f"{lat:.5f}","lon":f"{lon:.5f}","zoom":5,"addressdetails":1})
 req=Request(f"https://nominatim.openstreetmap.org/reverse?{params}",headers={"User-Agent":"DivinityHarmony/1.0 (https://mantra.sigq.in)","Accept-Language":"en"})
 with urlopen(req,timeout=8) as response: payload=json.loads(response.read().decode("utf-8"))
 address=payload.get("address",{});state=str(address.get("state","")).strip();country=str(address.get("country_code","")).lower()
 script,language=STATE_SCRIPTS.get(state.casefold(),("devanagari","Sanskrit / Hindi"))
 result={"script":script,"language":language,"state":state,"countryCode":country}
 with _LOCK:_CACHE[key]=(now,result)
 return result
