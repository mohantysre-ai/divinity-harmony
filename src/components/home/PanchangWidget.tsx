import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Sunrise, Sunset } from 'lucide-react';

type Panchang = { date:string;tithi:string;nakshatra:string;yoga:string;karana:string;sunrise:string;sunset:string;precision:string };

export default function PanchangWidget() {
  const [data, setData] = useState<Panchang | null>(null);
  const [locationUsed, setLocationUsed] = useState(false);
  const load = (lat?: number, lon?: number) => {
    const params = new URLSearchParams({ date: new Date().toISOString().slice(0, 10) });
    if (lat != null && lon != null) { params.set('lat', String(lat)); params.set('lon', String(lon)); }
    void fetch(`/api/panchang?${params}`).then((response) => response.json()).then(setData).catch(() => setData(null));
  };
  useEffect(() => { load(); }, []);
  const localize = () => navigator.geolocation?.getCurrentPosition((position) => { setLocationUsed(true); load(position.coords.latitude, position.coords.longitude); });
  return <section className="bg-gradient-to-r from-orange-900 to-red-900 py-8 text-orange-50">
    <div className="container mx-auto px-5 lg:px-8"><div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      <div><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-orange-200"><CalendarDays className="h-4 w-4" />Today’s Panchang</p><h2 className="mt-2 text-2xl font-bold">{data?.tithi || 'Loading daily calendar…'}</h2><button onClick={localize} className="mt-2 inline-flex items-center text-xs text-orange-200 hover:text-white"><MapPin className="mr-1 h-3 w-3" />{locationUsed ? 'Using your location' : 'Use my location'}</button></div>
      {data && <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-5"><div><span className="block text-orange-300">Nakshatra</span>{data.nakshatra}</div><div><span className="block text-orange-300">Yoga</span>{data.yoga}</div><div><span className="block text-orange-300">Karana</span>{data.karana}</div><div><span className="flex items-center gap-1 text-orange-300"><Sunrise className="h-3 w-3" />Sunrise</span>{data.sunrise}</div><div><span className="flex items-center gap-1 text-orange-300"><Sunset className="h-3 w-3" />Sunset</span>{data.sunset}</div></div>}
    </div>{data && <p className="mt-5 text-[11px] text-orange-200/75">{data.precision}</p>}</div>
  </section>;
}
