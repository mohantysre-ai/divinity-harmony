import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  Sparkles,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/hooks/use-locale";
import type { UiKey } from "@/lib/ui-keys";

const productKeys = [
  ["myDharma", "/my-dharma"],
  ["mantraLibrary", "/mantras"],
  ["liveTempleDarshan", "/darshan"],
  ["sacredTexts", "/scriptures"],
] as const;
const discoverKeys = [
  ["cultureOfIndia", "/culture"],
  ["pravachanReading", "/wisdom"],
  ["vedicAstrology", "/astrology"],
  ["templePriestDirectory", "/temples"],
] as const;
const socials = [
  {
    label: "Facebook",
    url: import.meta.env.VITE_FACEBOOK_URL?.trim(),
    icon: Facebook,
  },
  {
    label: "Instagram",
    url: import.meta.env.VITE_INSTAGRAM_URL?.trim(),
    icon: Instagram,
  },
  {
    label: "YouTube",
    url: import.meta.env.VITE_YOUTUBE_URL?.trim(),
    icon: Youtube,
  },
].filter((item) => item.url);

export default function Footer() {
  const { tk } = useLocale();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const supportUrl = import.meta.env.VITE_SUPPORT_URL?.trim();
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();
  const subscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setState("error");
      setMessage(tk("pleaseConfirmSubscribe"));
      return;
    }
    setState("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Subscription failed");
      setState("success");
      setMessage(
        data.alreadySubscribed
          ? tk("alreadySubscribed")
          : tk("welcomeSubscribed"),
      );
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : tk("pleaseTryAgain"));
    }
  };
  return (
    <footer className="relative overflow-hidden border-t border-orange-950/10 bg-[#fff8ed] dark:bg-stone-950">
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-orange-300/15 blur-3xl" />
      <div className="container relative mx-auto px-5 lg:px-8">
        <section className="relative -mx-1 mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-800 via-red-800 to-rose-900 px-6 py-9 text-white shadow-2xl shadow-orange-950/15 md:px-10 lg:grid lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-12">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-amber-200/15 shadow-[0_0_0_32px_rgba(253,230,138,.05),0_0_0_64px_rgba(253,230,138,.035)]" />
          <div className="relative">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.2em] text-amber-200">
              <Sparkles className="h-4 w-4" />
              {tk("newsletterTagline")}
            </p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              {tk("carryPractice")}
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-orange-100/75">
              {tk("newsletterDesc")}
            </p>
          </div>
          <form onSubmit={subscribe} className="relative mt-7 lg:mt-0">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tk("emailAddressPlaceholder")}
                aria-label={tk("newsletterEmail")}
                className="h-12 border-white/20 bg-white text-stone-900 placeholder:text-stone-500 sm:flex-1"
              />
              <Button
                disabled={state === "loading"}
                className="h-12 bg-amber-400 px-6 font-bold text-stone-950 hover:bg-amber-300"
              >
                {state === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {tk("subscribe")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            <div className="mt-3 flex items-start gap-2">
              <Checkbox
                id="newsletter-consent"
                checked={consent}
                onCheckedChange={(value) => setConsent(value === true)}
                className="mt-0.5 border-white/60 data-[state=checked]:bg-amber-400 data-[state=checked]:text-stone-950"
              />
              <Label
                htmlFor="newsletter-consent"
                className="text-xs font-normal leading-5 text-orange-100/75"
              >
                {tk("subscribeAgreement")}
              </Label>
            </div>
            {message && (
              <p
                role="status"
                className={`mt-3 flex items-center text-xs ${state === "success" ? "text-emerald-200" : "text-amber-200"}`}
              >
                {state === "success" && (
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                )}
                {message}
              </p>
            )}
          </form>
        </section>
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-700 to-red-700 text-xl font-bold text-white shadow-lg">
                ॐ
              </span>
              <span className="text-xl font-bold">{tk("divinityHarmony")}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              {tk("footerTagline")}
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-muted-foreground transition hover:-translate-y-1 hover:border-orange-400 hover:text-orange-700 dark:bg-card"
                  >
                    <item.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <FooterColumn title={tk("practice")} links={productKeys} tk={tk} />
          <FooterColumn title={tk("discover")} links={discoverKeys} tk={tk} />
          <div>
            <h3 className="font-bold">{tk("trustAndSupport")}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <Link
                  className="text-muted-foreground hover:text-orange-700"
                  to="/legal/privacy"
                >
                  {tk("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-orange-700"
                  to="/legal/terms"
                >
                  {tk("termsOfUse")}
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-orange-700"
                  to="/legal/accessibility"
                >
                  {tk("accessibility")}
                </Link>
              </li>
              {contactEmail && (
                <li>
                  <a
                    className="inline-flex items-center text-muted-foreground hover:text-orange-700"
                    href={`mailto:${contactEmail}`}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {contactEmail}
                  </a>
                </li>
              )}
              {supportUrl && (
                <li>
                  <a
                    className="inline-flex items-center text-muted-foreground hover:text-orange-700"
                    href={supportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tk("supportTheProject")}
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-orange-950/10 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {tk("divinityHarmony")}.</p>
          <p>{tk("footerDisclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
function FooterColumn({
  title,
  links,
  tk,
}: {
  title: string;
  links: readonly (readonly [UiKey, string])[];
  tk: (key: UiKey) => string;
}) {
  return (
    <div>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map(([labelKey, url]) => (
          <li key={url}>
            <Link
              className="group inline-flex items-center text-muted-foreground transition hover:translate-x-1 hover:text-orange-700"
              to={url}
            >
              {tk(labelKey)}
              <ArrowRight className="ml-1.5 h-3 w-0 opacity-0 transition-all group-hover:w-3 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
