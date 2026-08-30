import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Heart,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { culturePacks } from "@/data/culture-packs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocale } from "@/hooks/use-locale";
import { ROUTINE_ITEMS } from "@/lib/routine-i18n";
type Profile = {
  currentState: string;
  homeTradition: string;
  language: string;
  ishta: string;
  calendar: string;
};
type Reminder = { id: string; name: string; date: string; note: string };
const defaultProfile: Profile = {
  currentState: "",
  homeTradition: "",
  language: "English",
  ishta: "",
  calendar: "",
};
const read = <T,>(key: string, fallback: T): T => {
  try {
    return JSON.parse(localStorage.getItem(key) || "") as T;
  } catch {
    return fallback;
  }
};
export default function MyDharmaPage() {
  const { tk, lc } = useLocale();
  const [profile, setProfile] = useState<Profile>(() =>
    read("my-dharma:profile", defaultProfile),
  );
  const [reminders, setReminders] = useState<Reminder[]>(() =>
    read("my-dharma:reminders", []),
  );
  const [practice, setPractice] = useState<string[]>(() =>
    read("my-dharma:practice", []),
  );
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const pack = useMemo(
    () =>
      culturePacks.find(
        (x) => x.id === profile.homeTradition || x.id === profile.currentState,
      ),
    [profile],
  );
  const save = () =>
    localStorage.setItem("my-dharma:profile", JSON.stringify(profile));
  const toggle = (item: string) => {
    const next = practice.includes(item)
      ? practice.filter((x) => x !== item)
      : [...practice, item];
    setPractice(next);
    localStorage.setItem("my-dharma:practice", JSON.stringify(next));
  };
  const add = () => {
    if (!name || !date) return;
    const next = [
      ...reminders,
      { id: crypto.randomUUID(), name, date, note },
    ].sort((a, b) => a.date.localeCompare(b.date));
    setReminders(next);
    localStorage.setItem("my-dharma:reminders", JSON.stringify(next));
    setName("");
    setDate("");
    setNote("");
  };
  const remove = (id: string) => {
    const next = reminders.filter((x) => x.id !== id);
    setReminders(next);
    localStorage.setItem("my-dharma:reminders", JSON.stringify(next));
  };
  const routine = ROUTINE_ITEMS.map((item) => item.id);
  return (
    <ThemeProvider>
      <Layout>
        <main>
          <section className="rounded-[2rem] bg-gradient-to-br from-orange-800 to-red-900 p-8 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[.22em] text-amber-200">
              {tk("personalSpiritualHome")}
            </p>
            <h1 className="mt-2 text-4xl font-bold">{tk("myDharma")}</h1>
            <p className="mt-3 max-w-3xl text-orange-100/80">
              {tk("myDharmaHeroDesc")}
            </p>
          </section>
          <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-red-600" />
                  {tk("myTraditionProfile")}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <Field label={tk("currentState")}>
                  <PackSelect
                    value={profile.currentState}
                    onChange={(value) =>
                      setProfile({ ...profile, currentState: value })
                    }
                  />
                </Field>
                <Field label={tk("homeStateTradition")}>
                  <PackSelect
                    value={profile.homeTradition}
                    onChange={(value) =>
                      setProfile({ ...profile, homeTradition: value })
                    }
                  />
                </Field>
                <Field label={tk("preferredLanguage")}>
                  <Input
                    value={profile.language}
                    onChange={(e) =>
                      setProfile({ ...profile, language: e.target.value })
                    }
                  />
                </Field>
                <Field label={tk("ishtaKulaDevata")}>
                  <Input
                    value={profile.ishta}
                    onChange={(e) =>
                      setProfile({ ...profile, ishta: e.target.value })
                    }
                  />
                </Field>
                <Field label={tk("calendarTradition")}>
                  <Input
                    value={profile.calendar}
                    onChange={(e) =>
                      setProfile({ ...profile, calendar: e.target.value })
                    }
                    placeholder={
                      pack?.calendar || tk("chooseFamilyCalendar")
                    }
                  />
                </Field>
                <div className="flex items-end">
                  <Button className="w-full" onClick={save}>
                    <Save className="mr-2 h-4 w-4" />
                    {tk("saveMyDharma")}
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-orange-600" />
                  {tk("todaysPractice")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ROUTINE_ITEMS.map((entry) => (
                  <label
                    key={entry.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border p-3"
                  >
                    <Checkbox
                      checked={practice.includes(entry.id)}
                      onCheckedChange={() => toggle(entry.id)}
                    />
                    <span
                      className={
                        practice.includes(entry.id)
                          ? "text-muted-foreground line-through"
                          : ""
                      }
                    >
                      {tk(entry.key)}
                      {entry.id === "Ishta-devata mantra" && profile.ishta
                        ? ` · ${profile.ishta}`
                        : ""}
                    </span>
                  </label>
                ))}
                <p className="pt-2 text-sm text-muted-foreground">
                  {tk("practiceCompletedTemplate", {
                    done: String(practice.length),
                    total: String(routine.length),
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
          {pack && (
            <section className="mt-6 grid gap-4 md:grid-cols-3">
              <Info
                title={tk("calendarNameTemplate", { name: lc(pack.name) })}
                values={[pack.calendar, pack.language, pack.script]}
              />
              <Info title={tk("signatureObservances")} values={pack.festivals} />
              <Info
                title={tk("traditionsAndTemples")}
                values={[...pack.traditions, ...pack.temples]}
              />
            </section>
          )}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="text-orange-600" />
                {tk("familyRitualReminders")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-[1fr_180px_1fr_auto]">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tk("reminderNamePlaceholder")}
                />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={tk("reminderNotePlaceholder")}
                />
                <Button onClick={add}>
                  <Plus className="mr-2 h-4 w-4" />
                  {tk("add")}
                </Button>
              </div>
              <div className="mt-5 space-y-2">
                {reminders.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border p-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <div className="flex-1">
                      <strong>{item.name}</strong>
                      <p className="text-sm text-muted-foreground">
                        {item.date}
                        {item.note ? ` · ${item.note}` : ""}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => remove(item.id)}
                      aria-label={tk("deleteReminder")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {!reminders.length && (
                  <p className="text-sm text-muted-foreground">
                    {tk("noFamilyDatesSaved")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </Layout>
    </ThemeProvider>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
function PackSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { tk, lc } = useLocale();
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={tk("selectStateOrUt")} />
      </SelectTrigger>
      <SelectContent>
        {culturePacks.map((x) => (
          <SelectItem key={x.id} value={x.id}>
            {lc(x.name)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
function Info({ title, values }: { title: string; values: string[] }) {
  const { lc } = useLocale();
  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="font-bold">{title}</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {values.map((x, i) => (
            <li key={`${title}-${i}`}>• {lc(x)}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
