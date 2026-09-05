import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Flame,
  Flower2,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import ResilientCoverImage from "@/components/ResilientCoverImage";
import { deities, type Deity } from "@/data/deities";
import { useLocale } from "@/hooks/use-locale";
import { scriptForAppLocale } from "@/lib/locale-script";
import { transliterateMantra } from "@/lib/transliterate";
import { virtualPujaCopy, type VirtualPujaCopyKey } from "./virtual-puja-copy";

export type VirtualPujaGuide = {
  name: string;
  region?: string;
  priestRequired?: boolean;
  purpose: string;
  duration: string;
  materials: string[];
  steps: string[];
  note: string;
};

type RitualAction = "tap" | "hold" | "target" | "flowers" | "incense" | "aarti";

type RitualStep = {
  id: string;
  devanagari: string;
  english: string;
  action: RitualAction;
};

const RITUAL_STEPS: RitualStep[] = [
  { id: "sankalpa", devanagari: "संकल्प", english: "Sankalpa", action: "hold" },
  { id: "avahana", devanagari: "ध्यान एवं आवाहन", english: "Dhyana and Avahana", action: "tap" },
  { id: "asana", devanagari: "आसन", english: "Asana", action: "tap" },
  { id: "padya", devanagari: "पाद्य", english: "Padya", action: "hold" },
  { id: "arghya", devanagari: "अर्घ्य", english: "Arghya", action: "tap" },
  { id: "achamaniya", devanagari: "आचमनीय", english: "Achamaniya", action: "tap" },
  { id: "snana", devanagari: "स्नान एवं अभिषेक", english: "Snana and Abhisheka", action: "hold" },
  { id: "vastra", devanagari: "वस्त्र", english: "Vastra", action: "tap" },
  { id: "alankara", devanagari: "यज्ञोपवीत एवं अलंकार", english: "Yajnopavita and Alankara", action: "tap" },
  { id: "tilaka", devanagari: "गंध एवं तिलक", english: "Gandha and Tilaka", action: "target" },
  { id: "pushpa", devanagari: "पुष्पार्चन", english: "Pushparchana", action: "flowers" },
  { id: "dhoopa", devanagari: "धूप", english: "Dhoopa", action: "incense" },
  { id: "deepa", devanagari: "दीप", english: "Deepa", action: "hold" },
  { id: "naivedya", devanagari: "नैवेद्य एवं ताम्बूल", english: "Naivedya and Tambula", action: "tap" },
  { id: "nirajana", devanagari: "नीराजन एवं मंत्रपुष्प", english: "Aarti and Mantrapushpa", action: "aarti" },
  { id: "samarpana", devanagari: "प्रदक्षिणा, नमस्कार एवं समर्पण", english: "Pradakshina and Samarpana", action: "hold" },
];

const DEITY_MANTRAS: Record<string, string> = {
  ganesha: "ॐ गं गणपतये नमः",
  shiva: "ॐ नमः शिवाय",
  vishnu: "ॐ नमो नारायणाय",
  krishna: "ॐ नमो भगवते वासुदेवाय",
  rama: "श्री राम जय राम जय जय राम",
  devi: "ॐ दुं दुर्गायै नमः",
  lakshmi: "ॐ श्रीं महालक्ष्म्यै नमः",
  saraswati: "ॐ ऐं सरस्वत्यै नमः",
  hanuman: "ॐ हनुमते नमः",
  surya: "ॐ सूर्याय नमः",
};

const DEITY_RULES: Array<[RegExp, string]> = [
  [/shiva|rudra/i, "shiva"],
  [/lakshmi|varamaha/i, "lakshmi"],
  [/durga|devi/i, "devi"],
  [/saraswati/i, "saraswati"],
  [/hanuman/i, "hanuman"],
  [/krishna|janmashtami/i, "krishna"],
  [/rama/i, "rama"],
  [/satyanarayan|vishnu|ekadashi|tulsi|onam/i, "vishnu"],
  [/surya|chhath|navagraha/i, "surya"],
  [/ganapati|ganesha|griha|wedding|namakarana|annaprashana|upanayana|ayudha/i, "ganesha"],
];

const FLOWERS = ["🌼", "🌺", "🌸", "🌼", "🌺"];
const AARTI_ROTATION_NEEDED = 720;

function deityForPuja(name: string): Deity {
  const slug = DEITY_RULES.find(([pattern]) => pattern.test(name))?.[1] ?? "ganesha";
  return deities.find((deity) => deity.slug === slug) ?? deities[0];
}

function useTempleBell(muted: boolean) {
  const contextRef = useRef<AudioContext>();

  useEffect(
    () => () => {
      void contextRef.current?.close();
    },
    [],
  );

  return useCallback(() => {
    if (muted || typeof window === "undefined" || !window.AudioContext) return;
    const context = contextRef.current ?? new window.AudioContext();
    contextRef.current = context;
    if (context.state === "suspended") void context.resume();
    const start = context.currentTime;
    [660, 990, 1584, 2310].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.2 / (index + 1), start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.35);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 1.4);
    });
  }, [muted]);
}

export function VirtualPuja({
  puja,
  onClose,
}: {
  puja: VirtualPujaGuide;
  onClose: () => void;
}) {
  const { lc, lcl, locale } = useLocale();
  const vt = useCallback((key: VirtualPujaCopyKey) => virtualPujaCopy(locale, key), [locale]);
  const deity = useMemo(() => deityForPuja(puja.name), [puja.name]);
  const script = scriptForAppLocale(locale);
  const mantra = transliterateMantra(DEITY_MANTRAS[deity.slug], script);
  const [screen, setScreen] = useState<"gate" | "prepare" | "ritual" | "complete">("gate");
  const [materialChecks, setMaterialChecks] = useState<Set<number>>(new Set());
  const [stepIndex, setStepIndex] = useState(0);
  const [stepDone, setStepDone] = useState(false);
  const [muted, setMuted] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [flowerCount, setFlowerCount] = useState(0);
  const [waterActive, setWaterActive] = useState(false);
  const [dressed, setDressed] = useState(false);
  const [tilaka, setTilaka] = useState(false);
  const [incenseLit, setIncenseLit] = useState(false);
  const [lampLit, setLampLit] = useState(false);
  const [foodOffered, setFoodOffered] = useState(false);
  const [aartiRotation, setAartiRotation] = useState(0);
  const [lampPoint, setLampPoint] = useState({ x: 50, y: 78 });
  const holdTimer = useRef<number>();
  const lastAngle = useRef<number>();
  const draggingAarti = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringBell = useTempleBell(muted);
  const step = RITUAL_STEPS[stepIndex];

  const finishStep = useCallback(() => {
    setStepDone(true);
    ringBell();
  }, [ringBell]);

  const stopHold = useCallback(() => {
    if (holdTimer.current !== undefined) window.clearInterval(holdTimer.current);
    holdTimer.current = undefined;
    if (step?.id === "padya" || step?.id === "snana") setWaterActive(false);
  }, [step?.id]);

  useEffect(() => stopHold, [stopHold]);

  const startHold = () => {
    if (stepDone || holdTimer.current !== undefined) return;
    if (step.id === "padya" || step.id === "snana") setWaterActive(true);
    if (step.id === "dhoopa") setIncenseLit(true);
    holdTimer.current = window.setInterval(() => {
      setHoldProgress((current) => {
        const next = Math.min(100, current + 3);
        if (next === 100) {
          window.setTimeout(() => {
            if (step.id === "deepa") setLampLit(true);
            stopHold();
            finishStep();
          }, 0);
        }
        return next;
      });
    }, 42);
  };

  const completeTap = () => {
    if (stepDone) return;
    if (step.id === "vastra" || step.id === "alankara") setDressed(true);
    if (step.id === "naivedya") setFoodOffered(true);
    finishStep();
  };

  const offerFlower = () => {
    if (stepDone) return;
    const next = flowerCount + 1;
    setFlowerCount(next);
    ringBell();
    if (next >= FLOWERS.length) finishStep();
  };

  const handleAartiDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (step.action !== "aarti" || stepDone) return;
    draggingAarti.current = true;
    lastAngle.current = undefined;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleAartiMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingAarti.current || !stageRef.current || stepDone) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const angle = (Math.atan2(y - rect.height / 2, x - rect.width / 2) * 180) / Math.PI;
    setLampPoint({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    if (lastAngle.current !== undefined) {
      let delta = angle - lastAngle.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;
      setAartiRotation((current) => {
        const next = Math.min(AARTI_ROTATION_NEEDED, current + Math.abs(delta));
        if (next >= AARTI_ROTATION_NEEDED) {
          setLampLit(true);
          window.setTimeout(finishStep, 0);
        }
        return next;
      });
    }
    lastAngle.current = angle;
  };

  const stopAarti = () => {
    draggingAarti.current = false;
    lastAngle.current = undefined;
  };

  const nextStep = () => {
    if (stepIndex === RITUAL_STEPS.length - 1) {
      setScreen("complete");
      ringBell();
      return;
    }
    setStepIndex((current) => current + 1);
    setStepDone(false);
    setHoldProgress(0);
  };

  const previousStep = () => {
    if (stepIndex === 0) {
      setScreen("prepare");
      return;
    }
    setStepIndex((current) => current - 1);
    setStepDone(true);
    setHoldProgress(100);
  };

  const restart = () => {
    setScreen("gate");
    setMaterialChecks(new Set());
    setStepIndex(0);
    setStepDone(false);
    setHoldProgress(0);
    setFlowerCount(0);
    setWaterActive(false);
    setDressed(false);
    setTilaka(false);
    setIncenseLit(false);
    setLampLit(false);
    setFoodOffered(false);
    setAartiRotation(0);
    setLampPoint({ x: 50, y: 78 });
  };

  const translatedStep = locale === "en" ? step.english : transliterateMantra(step.devanagari, script);
  const ritualPercent = Math.round(((stepIndex + (stepDone ? 1 : 0)) / RITUAL_STEPS.length) * 100);
  const materialReady = materialChecks.size === puja.materials.length;
  const guideIndex = Math.min(
    puja.steps.length - 1,
    Math.floor((stepIndex * puja.steps.length) / RITUAL_STEPS.length),
  );

  return (
    <div className="vp-overlay" role="dialog" aria-modal="true" aria-label={lc(`${puja.name} guided puja`)}>
      <section className={`vp-shell vp-${screen}`}>
        <div className="vp-embers" aria-hidden>
          {Array.from({ length: 18 }, (_, index) => (
            <i
              key={index}
              style={{
                left: `${(index * 41) % 100}%`,
                width: `${3 + (index % 4)}px`,
                height: `${3 + (index % 4)}px`,
                animationDuration: `${7 + (index % 6)}s`,
                animationDelay: `${index * -0.7}s`,
              }}
            />
          ))}
        </div>
        <button type="button" className="vp-close" onClick={onClose} aria-label={lc("Close guided puja")}>
          <X />
        </button>

        {screen === "gate" && (
          <div className="vp-gate-screen">
            <div className="vp-temple-arch" aria-hidden>
              <span className="vp-arch-om">ॐ</span>
              <div className="vp-door vp-door-left" />
              <div className="vp-door vp-door-right" />
            </div>
            <button
              type="button"
              className="vp-bell-button"
              onClick={() => {
                ringBell();
                setScreen("prepare");
              }}
            >
              <span aria-hidden>🔔</span>
              {vt("ringToEnter")}
            </button>
            <p>{lc(puja.name)} · {vt("virtualWorship")}</p>
          </div>
        )}

        {screen === "prepare" && (
          <div className="vp-preparation">
            <header>
              <p>{lc(puja.region || "Regional household guidance")}</p>
              <h2>{vt("prepareSpace")}</h2>
              <span>{lc(puja.purpose)}</span>
            </header>
            <div className="vp-material-grid">
              {lcl(puja.materials).map((material, index) => (
                <button
                  type="button"
                  key={`${material}-${index}`}
                  className={materialChecks.has(index) ? "is-ready" : ""}
                  onClick={() =>
                    setMaterialChecks((current) => {
                      const next = new Set(current);
                      if (next.has(index)) next.delete(index);
                      else next.add(index);
                      return next;
                    })
                  }
                >
                  <span>{materialChecks.has(index) ? <Check /> : index + 1}</span>
                  {material}
                </button>
              ))}
            </div>
            <div className="vp-preparation-note">
              <Flame />
              <p>{lc(puja.note)}</p>
            </div>
            <Button
              type="button"
              className="vp-primary-action"
              disabled={!materialReady}
              onClick={() => {
                ringBell();
                setScreen("ritual");
              }}
            >
              {materialReady ? vt("begin") : vt("markAllReady")}
              <ChevronRight />
            </Button>
          </div>
        )}

        {screen === "ritual" && (
          <div className="vp-ritual-layout">
            <header className="vp-ritual-header">
              <div>
                <p>{lc(puja.name)}</p>
                <h2>{lc(deity.name)}</h2>
              </div>
              <div className="vp-header-actions">
                <button type="button" onClick={ringBell} aria-label={vt("ringBell")}>🔔</button>
                <button type="button" onClick={() => setMuted((current) => !current)} aria-label={vt(muted ? "soundOn" : "soundOff")}>
                  {muted ? <VolumeX /> : <Volume2 />}
                </button>
              </div>
            </header>

            <div className="vp-progress-track" aria-label={`${ritualPercent}%`}>
              <span style={{ width: `${ritualPercent}%` }} />
            </div>

            <div className="vp-sanctum" ref={stageRef} onPointerDown={handleAartiDown} onPointerMove={handleAartiMove} onPointerUp={stopAarti} onPointerCancel={stopAarti}>
              <div className="vp-halo" aria-hidden />
              <div className="vp-image-frame">
                <ResilientCoverImage
                  sources={[deity.imageUrl]}
                  searchQuery={`${deity.name} Hindu deity public domain art`}
                  alt={lc(deity.name)}
                  className="vp-deity-image"
                  objectPosition="50% 24%"
                />
                <div className="vp-image-warmth" />
                {dressed && <div className="vp-vastra-glow" aria-hidden />}
                {tilaka && <span className="vp-tilaka" aria-hidden />}
                {step.action === "target" && !stepDone && (
                  <button
                    type="button"
                    className="vp-tilaka-target"
                    aria-label={vt("touchPoint")}
                    onClick={() => {
                      setTilaka(true);
                      finishStep();
                    }}
                  />
                )}
              </div>

              {waterActive && <div className="vp-water-stream" aria-hidden>{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>}
              <div className={`vp-incense ${incenseLit ? "is-lit" : ""}`} aria-hidden><i /><span /><span /><span /></div>
              <div className={`vp-diya vp-diya-left ${lampLit ? "is-lit" : ""}`} aria-hidden><i /></div>
              <div className={`vp-diya vp-diya-right ${lampLit ? "is-lit" : ""}`} aria-hidden><i /></div>
              <div className="vp-flower-bed" aria-hidden>{FLOWERS.slice(0, flowerCount).map((flower, index) => <span key={index}>{flower}</span>)}</div>
              {foodOffered && <div className="vp-naivedya" aria-hidden><span>🍎</span><span>🍌</span><span>🥥</span></div>}
              {step.action === "aarti" && (
                <div className="vp-aarti-lamp" style={{ left: `${lampPoint.x}%`, top: `${lampPoint.y}%` }} aria-hidden>
                  <span />
                </div>
              )}
            </div>

            <div className="vp-step-panel" key={step.id}>
              <div className="vp-step-heading">
                <span>{String(stepIndex + 1).padStart(2, "0")} / {RITUAL_STEPS.length}</span>
                <div>
                  <p>{transliteratedStepLabel(step.devanagari, script)}</p>
                  <h3>{translatedStep}</h3>
                </div>
              </div>
              <p className="vp-mantra" data-no-regionalize>{mantra}</p>
              <p className="vp-specific-guide"><strong>{vt("guidance")}:</strong> {lc(puja.steps[guideIndex])}</p>

              {step.action === "flowers" && (
                <div className="vp-flower-actions">
                  {FLOWERS.map((flower, index) => (
                    <button type="button" key={index} disabled={index < flowerCount} onClick={offerFlower} aria-label={vt("offerNow")}>{flower}</button>
                  ))}
                  <span>{flowerCount} / {FLOWERS.length}</span>
                </div>
              )}

              {(step.action === "hold" || step.action === "incense") && (
                <button type="button" className="vp-hold-action" disabled={stepDone} onPointerDown={startHold} onPointerUp={stopHold} onPointerLeave={stopHold}>
                  <i style={{ width: `${holdProgress}%` }} />
                  <span>{stepDone ? vt("complete") : vt("holdToOffer")}</span>
                </button>
              )}

              {step.action === "tap" && (
                <button type="button" className="vp-tap-action" disabled={stepDone} onClick={completeTap}>
                  {stepDone ? <Check /> : <Flower2 />}
                  {stepDone ? vt("complete") : vt("offerNow")}
                </button>
              )}

              {step.action === "target" && <p className="vp-gesture-hint">{stepDone ? vt("tilakaOffered") : vt("touchPoint")}</p>}
              {step.action === "aarti" && <p className="vp-gesture-hint">{stepDone ? vt("aartiComplete") : `${Math.round((aartiRotation / AARTI_ROTATION_NEEDED) * 100)}% · ${vt("circleLamp")}`}</p>}

              <div className="vp-step-navigation">
                <Button type="button" variant="outline" onClick={previousStep}><ChevronLeft />{vt("previous")}</Button>
                <Button type="button" disabled={!stepDone} onClick={nextStep}>{stepIndex === RITUAL_STEPS.length - 1 ? vt("finish") : vt("continue")}<ChevronRight /></Button>
              </div>
            </div>
          </div>
        )}

        {screen === "complete" && (
          <div className="vp-complete-screen">
            <div className="vp-complete-halo"><span>ॐ</span></div>
            <div className="vp-petal-rain" aria-hidden>{Array.from({ length: 24 }, (_, index) => <i key={index} style={{ left: `${(index * 37) % 100}%`, fontSize: `${18 + (index % 4) * 3}px`, animationDuration: `${4 + (index % 4)}s`, animationDelay: `${index * -0.24}s` } as CSSProperties}>{FLOWERS[index % FLOWERS.length]}</i>)}</div>
            <p>{mantra}</p>
            <h2>{lc("Puja guide complete")}</h2>
            <span>{vt("completeMessage")}</span>
            <div>
              <Button type="button" variant="outline" onClick={onClose}>{vt("finish")}</Button>
              <Button type="button" onClick={restart}><RotateCcw />{vt("performAgain")}</Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function transliteratedStepLabel(devanagari: string, script: ReturnType<typeof scriptForAppLocale>) {
  return transliterateMantra(devanagari, script);
}
