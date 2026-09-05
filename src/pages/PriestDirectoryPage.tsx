import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Flower2,
  Languages,
  LocateFixed,
  Map,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import {
  VirtualPuja,
  type VirtualPujaGuide,
} from "@/components/puja/VirtualPuja";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";

type Priest = {
  id: number;
  city: string;
  state: string;
  languages: string[];
  services: string[];
  google_maps_url: string;
  google_search_url: string;
  sulekha_url: string;
};
type Puja = VirtualPujaGuide;
const pujas: Puja[] = [
  {
    name: "Griha Pravesh & Vastu Shanti",
    priestRequired: true,
    purpose: "Purification and auspicious entry into a new home.",
    duration: "2–4 hours",
    materials: [
      "Kalasha, coconut and mango leaves",
      "Turmeric, kumkum, flowers and fruits",
      "Havan samagri, ghee and new cloth",
    ],
    steps: [
      "Clean the home and prepare the northeast altar.",
      "Begin with achamana, sankalpa and Ganesha invocation.",
      "Perform kalasha sthapana, punya-vachana and Vastu worship.",
      "Conduct Navagraha prayer and the lineage-specific homa.",
      "Enter at the chosen muhurta, boil milk and offer naivedya.",
      "Perform aarti, distribute prasada and complete dakshina.",
    ],
    note: "Confirm exact muhurta, mantras and fire procedure with a qualified regional priest.",
  },
  {
    name: "Satyanarayan Puja",
    purpose:
      "A Vishnu observance commonly offered for gratitude and family welfare.",
    duration: "2–3 hours",
    materials: [
      "Vishnu image, kalasha and sacred thread",
      "Banana, tulasi, pancha-amrita and flowers",
      "Prasada ingredients and five lamps",
    ],
    steps: [
      "Purify the space and state the sankalpa.",
      "Invoke Ganesha, Navagrahas and kalasha deities.",
      "Offer shodashopachara worship to Shri Satyanarayan.",
      "Read or listen to the five traditional katha chapters.",
      "Offer naivedya and perform aarti.",
      "Make the closing prayer and share prasada.",
    ],
    note: "Regional katha order and offerings vary; follow the family sampradaya where known.",
  },
  {
    name: "Navagraha Homa",
    priestRequired: true,
    purpose:
      "Traditional worship of the nine grahas through mantra and fire offerings.",
    duration: "3–5 hours",
    materials: [
      "Nine grains and corresponding cloth/colors",
      "Homa kunda, wood, ghee and samagri",
      "Kalashas, flowers, fruits and sesame",
    ],
    steps: [
      "Perform purification, sankalpa and Ganesha puja.",
      "Establish the Navagraha mandala and kalashas.",
      "Invoke each graha with its prescribed mantra.",
      "Offer the required ahutis into the consecrated fire.",
      "Complete purnahuti, shanti patha and aarti.",
      "Receive guidance on any associated vrata or dana.",
    ],
    note: "Homa must be led by a trained priest; mantra counts and substances should not be improvised.",
  },
  {
    name: "Shraddha & Pitru Tarpana",
    priestRequired: true,
    purpose: "Ancestral remembrance according to family and regional custom.",
    duration: "1–3 hours",
    materials: [
      "Black sesame, darbha grass and clean water",
      "Cooked food or prescribed pindas",
      "Simple cloth, vessel and seasonal offerings",
    ],
    steps: [
      "Confirm tithi, family tradition and eligibility with the priest.",
      "Bathe, wear clean clothes and prepare a quiet place.",
      "Make the sankalpa naming the ancestral lineage as appropriate.",
      "Offer tila-tarpana and pindas under qualified guidance.",
      "Complete guest feeding or suitable dana.",
      "Conclude with prayers for peace and family welfare.",
    ],
    note: "This is lineage-sensitive. Consult a qualified purohit and do not publish private family details.",
  },
  {
    name: "Ganapati Puja",
    purpose: "Invocation of Shri Ganesha before new beginnings and ceremonies.",
    duration: "45–90 minutes",
    materials: [
      "Ganesha murti or image",
      "Durva grass, red flowers and modaka",
      "Lamp, incense, fruits and pancha-amrita",
    ],
    steps: [
      "Prepare the altar and perform achamana and sankalpa.",
      "Invoke Ganesha and offer ceremonial bathing.",
      "Offer vastra, sandal paste, durva, flowers and incense.",
      "Chant Ganesha mantras or Atharvashirsha as guided.",
      "Offer modaka/naivedya and perform aarti.",
      "Pray for removal of obstacles and share prasada.",
    ],
    note: "A household version may be devotional; formal prana-pratishtha requires guidance.",
  },
  {
    name: "Wedding Rituals",
    priestRequired: true,
    purpose:
      "Vivaha samskara joining the couple through sacred vows and tradition.",
    duration: "3–6 hours",
    materials: [
      "Regional wedding altar and sacred fire items",
      "Garlands, rice, turmeric, cloth and mangala items",
      "Offerings specified by both family traditions",
    ],
    steps: [
      "Confirm sampradaya and family customs in advance.",
      "Begin with Ganesha puja and protective rites.",
      "Complete welcoming and the corresponding family rite.",
      "Perform panigrahana, agni pradakshina and saptapadi.",
      "Exchange vows and complete mangala blessings.",
      "Conclude with aashirvada and family rites.",
    ],
    note: "Procedures vary significantly; coordinate both families and the officiating priest.",
  },
  {
    name: "Daily Shiva Puja",
    region: "Pan-Indian household practice",
    purpose: "A simple daily offering to Shiva without formal consecration or fire rites.",
    duration: "15–30 minutes",
    materials: ["Shiva image or household linga", "Clean water, lamp and incense", "Bilva leaves or available flowers and fruit"],
    steps: ["Bathe or wash hands and prepare a clean, quiet altar.", "Light the lamp and remember Ganesha and the family deity.", "Offer clean water gently, followed by sandal paste, flowers or bilva.", "Chant Om Namah Shivaya with attention.", "Offer fruit, perform a short aarti and sit silently before closing."],
    note: "Do not perform elaborate abhisheka on an antique or temple murti. Follow household and lineage custom.",
  },
  {
    name: "Lakshmi Friday Puja",
    region: "South and West Indian household traditions",
    purpose: "A household prayer for gratitude, wellbeing and ethical prosperity.",
    duration: "30–60 minutes",
    materials: ["Lakshmi image, lamp and rangoli", "Flowers, turmeric, kumkum and rice", "Fruit, milk sweet or regional naivedya"],
    steps: ["Clean the entrance and altar and draw a simple rangoli if customary.", "Light the lamp and make a clear sankalpa for family wellbeing.", "Offer turmeric, kumkum, flowers and akshata.", "Recite Lakshmi Ashtottara, Sri Sukta or a familiar Lakshmi prayer.", "Offer naivedya, perform aarti and share prasada respectfully."],
    note: "Use the prayer and offering tradition taught in your home; there is no need to imitate a different sampradaya.",
  },
  {
    name: "Durga Household Puja",
    region: "Pan-Indian Shakta household practice",
    purpose: "Devotional worship of the Divine Mother for courage, protection and gratitude.",
    duration: "30–75 minutes",
    materials: ["Durga image", "Red or seasonal flowers, lamp and incense", "Fruit, sweets and clean water"],
    steps: ["Prepare the altar and begin with purification and Ganesha remembrance.", "State the sankalpa without fear-based promises.", "Offer water, sandal paste, flowers, incense and lamp.", "Recite a familiar Devi stotra, names or simple mantra.", "Offer naivedya, aarti and prayers for the wellbeing of all."],
    note: "Tantric nyasa, bali and esoteric mantra practice require initiation and are not part of this household guide.",
  },
  {
    name: "Saraswati Puja",
    region: "Pan-Indian; Basant Panchami and regional forms",
    purpose: "Worship for learning, arts, wisdom and disciplined study.",
    duration: "30–60 minutes",
    materials: ["Saraswati image", "Books or instruments, lamp and flowers", "Fruit or simple naivedya"],
    steps: ["Clean the study space and place books or instruments respectfully.", "Light the lamp and invoke Ganesha.", "Offer water, flowers, incense and light to Saraswati.", "Recite Saraswati prayers and spend a few minutes in study or music.", "Offer naivedya and conclude with gratitude to teachers."],
    note: "Festival customs differ in Bengal, Odisha, Punjab and South India; use the local calendar and family practice.",
  },
  {
    name: "Hanuman Tuesday or Saturday Puja",
    region: "North, West and Central Indian household traditions",
    purpose: "Devotion focused on strength, service, courage and self-discipline.",
    duration: "20–45 minutes",
    materials: ["Hanuman image", "Lamp, flowers and fruit", "Sindoor only where household custom permits"],
    steps: ["Prepare a clean altar and remember Rama.", "Light the lamp and offer flowers and fruit.", "Recite Hanuman Chalisa, Bajrang Baan only if customary, or Rama nama.", "Reflect on one act of service or courage to practise today.", "Perform aarti and share prasada."],
    note: "Avoid applying substances to a murti unless the material and local temple custom permit it.",
  },
  {
    name: "Janmashtami Household Puja",
    region: "Pan-Indian Vaishnava traditions",
    purpose: "Celebration of Krishna's birth through fasting, kirtan and midnight worship.",
    duration: "60–120 minutes",
    materials: ["Krishna or Laddu Gopal image", "Tulasi, flowers and pancha-amrita", "Fruit, butter or regional fasting food"],
    steps: ["Confirm the local ashtami and Rohini observance time.", "Prepare the altar, lamp and Krishna cradle if customary.", "Sing Krishna nama, read the birth narrative and offer flowers.", "At the observed time, perform a gentle household abhisheka if appropriate.", "Dress the image, offer naivedya, aarti and break the fast as customary."],
    note: "Temple midnight schedules and household fasting rules differ by sampradaya and health needs.",
  },
  {
    name: "Varamahalakshmi Vrata",
    region: "Karnataka, Andhra Pradesh, Telangana and Tamil Nadu",
    purpose: "A regional vrata honouring Lakshmi for family welfare and gratitude.",
    duration: "60–120 minutes",
    materials: ["Decorated kalasha and coconut", "Turmeric, kumkum, flowers and sacred thread", "Regional naivedya and tambula"],
    steps: ["Confirm the vrata date in the local Panchanga and prepare the mantapa.", "Install the kalasha according to family custom.", "Invoke Ganesha, then Lakshmi with flowers and names.", "Tie the vrata thread and hear or read the traditional vrata katha.", "Offer regional naivedya, aarti, tambula and blessings."],
    note: "Kalasha decoration, toram count and katha differ by language region; follow the family's established method.",
  },
  {
    name: "Bengali Lakshmi Puja",
    region: "West Bengal and Bengali households",
    purpose: "Kojagari worship of Lakshmi according to Bengali household custom.",
    duration: "60–120 minutes",
    materials: ["Lakshmi image or pata", "Alpana materials, paddy and flowers", "Fruit, sweets and Bengali naivedya"],
    steps: ["Confirm Kojagari Purnima and clean the worship space.", "Draw alpana and arrange paddy and household symbols.", "Install the image and begin with purification and sankalpa.", "Offer flowers, incense, lamp, naivedya and read the local vrata katha.", "Perform aarti and distribute prasada."],
    note: "This guide is for the common household form; family paddhati and priest-led forms may be more detailed.",
  },
  {
    name: "Ayudha Puja",
    region: "Karnataka, Tamil Nadu, Andhra Pradesh, Telangana and Kerala",
    purpose: "Gratitude for tools, vehicles, books and instruments used in honest work.",
    duration: "30–60 minutes",
    materials: ["Cleaned tools, books or vehicle", "Lamp, sandal paste, kumkum and flowers", "Fruit and regional naivedya"],
    steps: ["Clean and safely arrange the objects without blocking exits or machinery.", "Switch off and secure powered equipment.", "Light the lamp and remember Ganesha and the chosen deity.", "Apply only material-safe marks and offer flowers.", "Offer naivedya, aarti and recommit to careful, ethical work."],
    note: "Never place flame near fuel, batteries, machinery or combustible decorations.",
  },
  {
    name: "Tulsi Vivah",
    region: "North, West and Central Indian Vaishnava traditions",
    purpose: "Ceremonial union of Tulsi and Vishnu forms marking the seasonal wedding period.",
    duration: "45–90 minutes",
    materials: ["Healthy Tulsi plant and Vishnu or Shaligrama representation", "Cloth, flowers, lamp and sugarcane where customary", "Fruit and sweets"],
    steps: ["Confirm the local observance date and clean the Tulsi area.", "Decorate Tulsi and the Vishnu representation respectfully.", "Perform Ganesha remembrance and sankalpa.", "Offer flowers and conduct the simple symbolic wedding sequence used by the family.", "Perform aarti, circumambulation and share prasada."],
    note: "Do not acquire or use sacred objects casually; follow the household tradition for Shaligrama worship.",
  },
  {
    name: "Chhath Puja Preparation",
    region: "Bihar, Jharkhand, eastern Uttar Pradesh and diaspora communities",
    purpose: "Preparation support for the disciplined Surya and Chhathi Maiya observance.",
    duration: "Four-day observance",
    materials: ["Clean bamboo baskets and seasonal fruits", "Thekua and prescribed sattvic offerings", "Lamp, clean cloth and safe water access"],
    steps: ["Follow the local four-day calendar and the vratin's established discipline.", "Maintain kitchen, vessel and offering purity according to family custom.", "Prepare offerings without tasting where that rule is followed.", "Use an officially safe ghat for evening and morning arghya.", "Protect children and elders near water and complete community distribution."],
    note: "This is a demanding regional vrata. Health, water safety and the instructions of experienced family/community members come first.",
  },
  {
    name: "Onam Thiruvonam Home Observance",
    region: "Kerala and Malayali households",
    purpose: "A family cultural and devotional observance of Thiruvonam and Mahabali remembrance.",
    duration: "Morning family observance",
    materials: ["Seasonal flowers for pookalam", "Lamp and clean traditional space", "Onasadya ingredients according to capacity"],
    steps: ["Confirm Thiruvonam in the Malayalam calendar.", "Clean the home and create a pookalam without wasteful materials.", "Light the lamp and offer family prayers.", "Prepare and share Onasadya with attention to dietary needs.", "Include elders, neighbours and acts of generosity."],
    note: "Onam practices are cultural and regional as well as devotional; respect the family's local form.",
  },
  {
    name: "Rudrabhisheka",
    region: "Pan-Indian Shaiva traditions",
    priestRequired: true,
    purpose: "Structured abhisheka and Rudra recitation for Shiva worship.",
    duration: "1–3 hours",
    materials: ["Appropriate Shiva linga and abhisheka vessel", "Water and substances approved for that linga", "Bilva, flowers, lamp and naivedya"],
    steps: ["Confirm sankalpa, recitation method and materials with the officiating priest.", "Prepare drainage and protect the worship space.", "Complete purification, Ganesha worship and kalasha preparation.", "Follow the priest during Rudra recitation and measured abhisheka.", "Complete alankara, naivedya, aarti and shanti prayers."],
    note: "The Vedic recitation and substance sequence should be led by a trained priest; do not pour damaging materials on a household murti.",
  },
  {
    name: "Namakarana",
    region: "Regional Hindu samskara traditions",
    priestRequired: true,
    purpose: "The naming samskara welcoming and blessing a child.",
    duration: "1–2 hours",
    materials: ["Family altar and child-safe seating", "Rice tray or regional naming materials", "Flowers, lamp, fruit and family offerings"],
    steps: ["Agree on the family tradition, date, name and health-safe gathering plan.", "Begin with purification, Ganesha worship and sankalpa.", "Perform the lineage-specific blessings under priestly guidance.", "Announce or write the name in the regional manner.", "Receive elders' blessings and share prasada."],
    note: "Protect the infant from smoke, loud sound, crowds and allergens; medical needs override ceremonial preferences.",
  },
  {
    name: "Annaprashana",
    region: "Regional Hindu samskara traditions",
    priestRequired: true,
    purpose: "The first ceremonial feeding of solid food to a child.",
    duration: "60–120 minutes",
    materials: ["Child-safe food approved by the family doctor", "Family altar, flowers and lamp", "Small clean bowl and spoon"],
    steps: ["Confirm developmental readiness, allergies and safe food with the child's clinician.", "Choose the family date and ritual form with the priest.", "Perform a short Ganesha and family-deity prayer.", "A parent offers only a tiny safe portion while the child is upright.", "Stop immediately if the child is distressed and conclude with blessings."],
    note: "This guide never replaces pediatric advice. Avoid honey, choking hazards and any food not medically appropriate for the child's age.",
  },
  {
    name: "Upanayana Preparation",
    region: "Lineage and Vedic school-specific samskara",
    priestRequired: true,
    purpose: "Preparation checklist for a lineage-specific initiation samskara.",
    duration: "One or more days",
    materials: ["Items specified by the family's acharya", "Traditional clothing and sacred-thread materials", "Homa and hospitality arrangements led by the priest"],
    steps: ["Identify the family's Veda shakha, sutra, gotra and qualified acharya.", "Agree on eligibility, date, language and teaching responsibilities.", "Obtain the acharya's exact materials list rather than a generic online list.", "Prepare the student for discipline, meaning and daily responsibilities.", "Follow the acharya throughout the samskara and post-ceremony teaching."],
    note: "This is an initiation, not a self-guided internet ritual. The app supports preparation only.",
  },
  {
    name: "Diwali Lakshmi-Ganesha Puja",
    region: "North and West Indian household traditions",
    purpose: "A household Diwali worship of Lakshmi and Ganesha with gratitude and ethical renewal.",
    duration: "45–90 minutes",
    materials: ["Lakshmi and Ganesha images", "Lamps, flowers, kumkum, rice and account book if customary", "Sweets, fruit and clean water"],
    steps: ["Confirm the local Amavasya puja window and clean the altar.", "Arrange lamps safely away from curtains, children and pets.", "Invoke Ganesha, then offer worship to Lakshmi.", "Offer flowers, naivedya and a prayer for honest prosperity.", "Perform aarti and extinguish unattended flames safely."],
    note: "Fireworks, lamps and electrical decorations require adult supervision and local safety compliance.",
  },
  {
    name: "Ekadashi Home Observance",
    region: "Vaishnava traditions across India",
    purpose: "A recurring day of restraint, remembrance of Vishnu and focused spiritual practice.",
    duration: "One lunar day",
    materials: ["Vishnu or Krishna image", "Tulasi, lamp, flowers and fruit", "Permitted fasting food where needed"],
    steps: ["Confirm Ekadashi and parana timing in the family's regional Panchanga.", "Choose a medically safe form of fasting or simple dietary restraint.", "Offer lamp, tulasi and prayer to Vishnu or Krishna.", "Read Gita or Bhagavata passages and practise nama japa.", "Break the fast in the proper window according to local tradition."],
    note: "Children, elders, pregnant people and anyone with a medical condition should not undertake unsafe fasting.",
  },
  {
    name: "Simple Daily Surya Arghya",
    region: "Pan-Indian household practice",
    purpose: "A brief morning practice of gratitude to Surya and the natural source of light.",
    duration: "5–15 minutes",
    materials: ["Clean water in a small vessel", "Safe open space facing the morning light", "Optional flower"],
    steps: ["Choose a safe non-slip place where water will not create a hazard.", "Stand comfortably; never stare directly at the sun.", "Offer a small stream of water with a familiar Surya prayer.", "Pause for gratitude and set an ethical intention for the day.", "Clean the area and conserve water."],
    note: "Protect the eyes and avoid rooftops, traffic areas or slippery surfaces.",
  },
];

export default function PriestDirectoryPage() {
  const { tk, lc, lcl } = useLocale();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Priest[]>([]);
  const [q, setQ] = useState(() => searchParams.get("search") || "");
  const [nearbyUrl, setNearbyUrl] = useState("");
  const [locationError, setLocationError] = useState("");
  const [ritualQuery, setRitualQuery] = useState("");
  const [guidedPuja, setGuidedPuja] = useState<Puja | null>(null);
  useEffect(() => {
    void fetch("/api/priests")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, []);
  const shown = useMemo(
    () =>
      items.filter((x) =>
        `${x.city} ${x.state} ${x.languages} ${x.services}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      ),
    [items, q],
  );
  const localSearch = useMemo(() => {
    const place = q.trim();
    if (!place) return null;
    const search = `pandit purohit priest puja services in ${place}`;
    const encoded = encodeURIComponent(search);
    return {
      place,
      maps: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      google: `https://www.google.com/search?q=${encodeURIComponent(`${search} contact phone reviews`)}`,
      justdial: `https://www.google.com/search?q=${encodeURIComponent(`site:justdial.com ${search}`)}`,
    };
  }, [q]);
  const shownPujas = useMemo(() => {
    const needle = ritualQuery.trim().toLowerCase();
    if (!needle) return pujas;
    return pujas.filter((puja) =>
      `${puja.name} ${puja.region || ""} ${puja.purpose}`
        .toLowerCase()
        .includes(needle),
    );
  }, [ritualQuery]);
  const locate = () => {
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError(tk("locationUnavailableBrowser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const query = encodeURIComponent(
          `pandit priest puja near ${p.coords.latitude.toFixed(5)},${p.coords.longitude.toFixed(5)}`,
        );
        setNearbyUrl(
          `https://www.google.com/maps/search/?api=1&query=${query}`,
        );
        const params = new URLSearchParams({
          lat: String(p.coords.latitude),
          lon: String(p.coords.longitude),
        });
        void fetch(`/api/location-preference?${params}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.place) setQ(data.place);
          })
          .catch(() => undefined);
      },
      () => setLocationError(tk("allowLocationPriests")),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 3600000 },
    );
  };
  return (
    <ThemeProvider>
      <Layout>
        <main>
          <section className="border-b bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 py-14 dark:from-orange-950/30 dark:via-background dark:to-rose-950/20">
            <div className="container mx-auto px-4">
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-orange-700">
                {tk("regionalRitualGuidance")}
              </p>
              <h1 className="mt-2 max-w-3xl text-4xl font-bold md:text-5xl">
                {tk("priestHeroTitle")}
              </h1>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
                {tk("priestHeroDesc")}
              </p>
              <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="h-11 bg-background pl-9"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={tk("searchPujaPlaceholder")}
                  />
                </div>
                <Button onClick={locate}>
                  <LocateFixed className="mr-2 h-4 w-4" />
                  {tk("findNearMe")}
                </Button>
              </div>
              {nearbyUrl && (
                <a
                  href={nearbyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-sm font-semibold text-orange-700 hover:underline"
                >
                  {tk("openPriestsNearMe")}
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              )}
              {locationError && (
                <p className="mt-2 text-sm text-destructive">{locationError}</p>
              )}
            </div>
          </section>
          <div className="container mx-auto px-4 py-10">
            <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              {tk("verifyDirectoryLinks")}
            </div>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {localSearch && (
                <article className="rounded-3xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-lg dark:from-orange-950/30 dark:to-background md:col-span-2 xl:col-span-3">
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div>
                      <Badge className="bg-orange-600 text-white">
                        {lc("Live locality search")}
                      </Badge>
                      <h2 className="mt-3 text-2xl font-bold">
                        {lc("Priests and puja services near")} {lc(localSearch.place)}
                      </h2>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {lc(
                          "This search is generated from the exact village, town, district, PIN code, language or puja you entered. It is not limited to the city cards below.",
                        )}
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <DirectoryAction url={localSearch.maps} label={lc("Google Maps")} icon={Map} />
                      <DirectoryAction url={localSearch.google} label={lc("Contact and reviews")} icon={Search} />
                      <DirectoryAction url={localSearch.justdial} label={lc("Justdial results")} icon={ExternalLink} />
                    </div>
                  </div>
                </article>
              )}
              {shown.map((x, i) => (
                <article
                  key={x.id}
                  style={{ animationDelay: `${i * 55}ms` }}
                  className="group animate-fade-in rounded-3xl border bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 dark:bg-orange-950/50">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {tk("publicDirectory")}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold">
                    {tk("cityPriestSearchTemplate", { city: x.city })}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {lc(x.state)}
                  </p>
                  <p className="mt-3 flex items-start text-sm text-muted-foreground">
                    <Languages className="mr-2 mt-0.5 h-4 w-4 shrink-0" />
                    {x.languages.map((lang) => lc(lang.trim())).join(", ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {x.services.map((s) => (
                      <Badge key={s} variant="secondary">
                        {lc(s)}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <a
                      href={x.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                    >
                      <Map className="mr-2 h-4 w-4" />
                      {tk("googleMaps")}
                    </a>
                    <a
                      href={x.sulekha_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-semibold hover:bg-muted"
                    >
                      {lc("Sulekha results")}
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </div>
                  <a
                    href={x.google_search_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-xs font-medium text-orange-700 hover:underline"
                  >
                    {tk("searchContactDetails")}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </article>
              ))}
            </section>
            {!shown.length && !localSearch && (
              <div className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">
                {tk("noDirectoryMatches")}
              </div>
            )}
            <section className="mt-16">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-orange-700">
                    {tk("pujaVidhiLibrary")}
                  </p>
                  <h2 className="text-3xl font-bold">
                    {tk("materialsStepsCompletion")}
                  </h2>
                </div>
              </div>
              <p className="mt-3 max-w-3xl text-muted-foreground">
                {tk("pujaPrepareIntro")}
              </p>
              <div className="relative mt-6 max-w-xl">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  value={ritualQuery}
                  onChange={(event) => setRitualQuery(event.target.value)}
                  className="pl-9"
                  placeholder={lc(
                    "Search daily puja, vrata, festival, samskara or regional ritual",
                  )}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {lc(`${shownPujas.length} guided rituals available`)}
              </p>
              <Accordion
                type="single"
                collapsible
                className="mt-7 grid gap-4 lg:grid-cols-2"
              >
                {shownPujas.map((p) => (
                  <AccordionItem
                    key={p.name}
                    value={p.name}
                    className="rounded-2xl border bg-card px-5 shadow-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div>
                        <span className="text-lg font-bold">{lc(p.name)}</span>
                        <span className="mt-1 block text-xs font-normal text-muted-foreground">
                          {tk("typicalDurationTemplate", { duration: lc(p.duration) })}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="leading-6 text-muted-foreground">
                        {lc(p.purpose)}
                      </p>
                      <h3 className="mt-5 font-semibold">{tk("prepareLabel")}</h3>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        {lcl(p.materials).map((m, i) => (
                          <li key={`${p.name}-mat-${i}`} className="flex gap-2">
                            <span className="text-orange-600">◆</span>
                            {m}
                          </li>
                        ))}
                      </ul>
                      <h3 className="mt-5 font-semibold">
                        {tk("traditionalSequence")}
                      </h3>
                      <ol className="mt-2 space-y-3 text-sm text-muted-foreground">
                        {lcl(p.steps).map((s, i) => (
                          <li key={`${p.name}-step-${i}`} className="flex gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 dark:bg-orange-950/50">
                              {i + 1}
                            </span>
                            <span className="pt-0.5">{s}</span>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-5 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                        {lc(p.note)}
                      </p>
                      <Button
                        type="button"
                        className="mt-5 w-full"
                        onClick={() => setGuidedPuja(p)}
                      >
                        <Flower2 className="mr-2 h-4 w-4" />
                        {lc("Start guided puja")}
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {!shownPujas.length && (
                <div className="mt-6 rounded-3xl border border-dashed p-8 text-center text-muted-foreground">
                  {lc(
                    "This ritual is not in the reviewed guide yet. Use the locality search above to find a qualified regional priest.",
                  )}
                </div>
              )}
            </section>
          </div>
          {guidedPuja && (
            <VirtualPuja puja={guidedPuja} onClose={() => setGuidedPuja(null)} />
          )}
        </main>
      </Layout>
    </ThemeProvider>
  );
}

function DirectoryAction({
  url,
  label,
  icon: Icon,
}: {
  url: string;
  label: string;
  icon: typeof Map;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-12 items-center justify-center rounded-xl border bg-background px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-orange-400"
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </a>
  );
}
