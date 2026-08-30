import { useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, Loader2, LogIn, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { useTheme } from "@/hooks/theme-context";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deviceHeaders } from "@/lib/device";
import {
  localeOptions,
  localeToProfileLanguage,
  profileLanguageToLocale,
  useLocale,
} from "@/hooks/use-locale";

export default function UserSettings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { user, loading, configured, signOut } = useAuth();
  const { locale, setLocale, tk } = useLocale();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [gotra, setGotra] = useState("");
  const [language, setLanguage] = useState("english");
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    if (user) {
      setName(String(user.user_metadata?.display_name || ""));
      setGotra(String(user.user_metadata?.gotra || ""));
      setAvatar(String(user.user_metadata?.avatar_url || ""));
      const saved = String(user.user_metadata?.language || "");
      if (saved && profileLanguageToLocale[saved]) {
        setLanguage(saved);
        setLocale(profileLanguageToLocale[saved]);
      } else {
        setLanguage(localeToProfileLanguage[locale] || "english");
      }
    } else if (!loading) {
      void fetch("/api/profile", { headers: deviceHeaders() })
        .then((r) => r.json())
        .then((p) => {
          setName(p.name || "");
          setGotra(p.gotra || "");
          const saved = p.language || "";
          if (saved && profileLanguageToLocale[saved]) {
            setLanguage(saved);
            setLocale(profileLanguageToLocale[saved]);
          } else {
            setLanguage(localeToProfileLanguage[locale] || "english");
          }
        })
        .catch(() => undefined);
    }
    setAutoplay(localStorage.getItem("preference:autoplay") === "true");
    setNotifications(localStorage.getItem("preference:notifications") !== "false");
  }, [user, loading, locale, setLocale]);

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    const nextLocale = profileLanguageToLocale[language] || "en";
    setLocale(nextLocale);
    if (user && supabase) {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: name.trim(),
          gotra: gotra.trim(),
          language,
          avatar_url: avatar,
        },
      });
      toast({
        title: error ? tk("unableToSave") : tk("profileUpdated"),
        description: error?.message || tk("profileSyncedDesc"),
        variant: error ? "destructive" : "default",
      });
      return;
    }
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: deviceHeaders(),
      body: JSON.stringify({ name, gotra, language }),
    });
    toast({
      title: response.ok ? tk("guestProfileSaved") : tk("unableToSave"),
      description: response.ok ? tk("guestSavedDesc") : tk("pleaseTryAgain"),
      variant: response.ok ? "default" : "destructive",
    });
  };

  const uploadAvatar = async (file?: File) => {
    if (!file || !user || !supabase) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      toast({ title: tk("avatarFileRequirement"), variant: "destructive" });
      return;
    }
    setUploading(true);
    const extension = (file.name.split(".").pop() || "jpg")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const path = `${user.id}/avatar.${extension}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });
    if (error) {
      setUploading(false);
      toast({
        title: tk("avatarUploadFailed"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?v=${Date.now()}`;
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: url },
    });
    setUploading(false);
    if (updateError) {
      toast({
        title: tk("avatarUpdateFailed"),
        description: updateError.message,
        variant: "destructive",
      });
      return;
    }
    setAvatar(url);
    toast({ title: tk("profilePhotoUpdated") });
  };

  const savePreferences = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("preference:autoplay", String(autoplay));
    localStorage.setItem("preference:notifications", String(notifications));
    toast({ title: tk("preferencesUpdated") });
  };

  const initials = (name || user?.email || "DH").slice(0, 2).toUpperCase();

  return (
    <ThemeProvider>
      <Layout>
        <main className="container mx-auto px-4 py-10">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-orange-700">
              {tk("yourAccount")}
            </p>
            <h1 className="mt-2 text-4xl font-bold">{tk("userSettings")}</h1>
            <p className="mt-2 text-muted-foreground">
              {user ? tk("accountConnectedSupabase") : tk("guestPreferences")}
            </p>
          </div>
          {!configured && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {tk("supabaseNotConfigured")}
            </div>
          )}
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">{tk("profile")}</TabsTrigger>
              <TabsTrigger value="preferences">{tk("preferences")}</TabsTrigger>
              <TabsTrigger value="account">{tk("account")}</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card className="overflow-hidden rounded-3xl">
                <div className="h-24 bg-gradient-to-r from-orange-800 via-red-800 to-amber-700" />
                <CardContent className="-mt-12 pb-8">
                  <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end">
                    <div className="relative w-fit">
                      <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                        <AvatarImage src={avatar} alt={tk("profilePhotoAlt")} />
                        <AvatarFallback className="text-2xl">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {user && (
                        <>
                          <input
                            ref={fileRef}
                            className="hidden"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => void uploadAvatar(e.target.files?.[0])}
                          />
                          <Button
                            type="button"
                            size="icon"
                            disabled={uploading}
                            onClick={() => fileRef.current?.click()}
                            className="absolute bottom-0 right-0 rounded-full"
                          >
                            {uploading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Camera className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                    <div className="pb-2">
                      <h2 className="text-2xl font-bold">
                        {name || tk("devotee")}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {user?.email || tk("guestProfile")}
                      </p>
                      {user && (
                        <span className="mt-2 inline-flex items-center text-xs font-medium text-emerald-700">
                          <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                          {tk("authenticatedProfile")}
                        </span>
                      )}
                    </div>
                  </div>
                  {!user && (
                    <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-2xl bg-orange-50 p-4 sm:flex-row sm:items-center dark:bg-orange-950/20">
                      <div>
                        <p className="font-semibold">{tk("syncProfilePhoto")}</p>
                        <p className="text-sm text-muted-foreground">
                          {tk("signInCrossDevice")}
                        </p>
                      </div>
                      <Button asChild>
                        <Link to="/login">
                          <LogIn className="mr-2 h-4 w-4" />
                          {tk("signIn")}
                        </Link>
                      </Button>
                    </div>
                  )}
                  <form
                    onSubmit={saveProfile}
                    className="grid gap-5 md:grid-cols-2"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">{tk("displayName")}</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={tk("yourNamePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gotra">{tk("gotraOptional")}</Label>
                      <Input
                        id="gotra"
                        value={gotra}
                        onChange={(e) => setGotra(e.target.value)}
                        placeholder={tk("enterIfKnown")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{tk("appLanguage")}</Label>
                      <p className="text-xs text-muted-foreground">
                        {tk("appLanguageHint")}
                      </p>
                      <Select
                        value={language}
                        onValueChange={(value) => {
                          setLanguage(value);
                          const mapped = profileLanguageToLocale[value];
                          if (mapped) setLocale(mapped);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {localeOptions.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={localeToProfileLanguage[item.id]}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" className="w-full md:w-auto">
                        {tk("saveProfile")}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preferences">
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>{tk("appearanceAndPlayback")}</CardTitle>
                  <CardDescription>{tk("preferencesGuestNote")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={savePreferences} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{tk("darkTheme")}</Label>
                        <p className="text-sm text-muted-foreground">
                          {tk("darkThemeDesc")}
                        </p>
                      </div>
                      <Switch
                        checked={theme === "dark"}
                        onCheckedChange={() =>
                          setTheme(theme === "dark" ? "light" : "dark")
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{tk("autoplayMedia")}</Label>
                        <p className="text-sm text-muted-foreground">
                          {tk("autoplayMediaDesc")}
                        </p>
                      </div>
                      <Switch checked={autoplay} onCheckedChange={setAutoplay} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>{tk("notifications")}</Label>
                        <p className="text-sm text-muted-foreground">
                          {tk("notificationsDesc")}
                        </p>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>
                    <Button type="submit">{tk("saveProfile")}</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="account">
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle>{tk("accountSecurity")}</CardTitle>
                  <CardDescription>
                    {user ? tk("sessionManagedSupabase") : tk("signInForSecurity")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : user ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 rounded-2xl border p-4">
                        <UserRound className="h-5 w-5 text-orange-700" />
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {tk("userIdLabel", { id: user.id })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => void signOut().then(() => navigate("/"))}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {tk("signOut")}
                      </Button>
                    </div>
                  ) : (
                    <Button asChild>
                      <Link to="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        {tk("signInOrCreate")}
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </Layout>
    </ThemeProvider>
  );
}
