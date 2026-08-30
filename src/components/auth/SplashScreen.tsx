import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { authEmailRedirectTo } from "@/lib/auth-redirect";
import { useLocale } from "@/hooks/use-locale";

interface Props {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, configured } = useAuth();
  const { tk } = useLocale();

  useEffect(() => {
    if (user) navigate("/settings", { replace: true });
  }, [user, navigate]);

  const finish = () => {
    onComplete?.();
    navigate("/", { replace: true });
  };

  const login = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      toast({
        title: tk("unableSignIn"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: tk("welcomeBack"),
      description: tk("spiritualProfileReady"),
    });
    finish();
  };

  const register = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (password.length < 8) {
      toast({
        title: tk("passwordTooShort"),
        description: tk("useEightChars"),
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: name.trim() },
        emailRedirectTo: authEmailRedirectTo("/login"),
      },
    });
    setBusy(false);
    if (error) {
      toast({
        title: tk("unableCreateAccount"),
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    if (!data.session) {
      toast({
        title: tk("checkYourEmail"),
        description: tk("emailConfirmDesc"),
      });
    } else finish();
  };

  const reset = async () => {
    if (!supabase || !email.trim()) {
      toast({ title: tk("enterEmailFirst") });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: authEmailRedirectTo("/settings") },
    );
    toast({
      title: error ? tk("resetUnavailable") : tk("passwordResetSent"),
      description: error?.message || tk("checkInboxReset"),
      variant: error ? "destructive" : "default",
    });
  };

  return (
    <div className="min-h-screen bg-[#fff8ed] md:grid md:grid-cols-2 dark:bg-background">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-orange-950 via-red-950 to-amber-900 p-12 text-white md:flex md:flex-col md:justify-between">
        <div className="absolute -right-24 top-16 h-80 w-80 rounded-full border border-amber-300/20 shadow-[0_0_0_45px_rgba(251,191,36,.06),0_0_0_90px_rgba(251,191,36,.04)]" />
        <Link
          to="/"
          className="relative inline-flex items-center text-sm text-orange-100/80 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tk("backToDivinityHarmony")}
        </Link>
        <div className="relative max-w-xl">
          <span className="text-7xl text-amber-300">ॐ</span>
          <h1 className="mt-6 text-5xl font-bold leading-tight">
            {tk("practiceRemembered")}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-orange-100/75">
            {tk("profileAcrossDevices")}
          </p>
        </div>
        <p className="relative flex items-center text-xs text-orange-100/60">
          <ShieldCheck className="mr-2 h-4 w-4" />
          {tk("authPoweredBy")}
        </p>
      </div>
      <div className="flex items-center justify-center p-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:hidden">
            <span className="text-5xl text-orange-700">ॐ</span>
            <h1 className="mt-3 text-3xl font-bold">{tk("divinityHarmony")}</h1>
          </div>
          {!configured ? (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle>{tk("authConfiguring")}</CardTitle>
                <CardDescription>{tk("guestAccessAvailable")}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={finish}>
                  {tk("continueAsGuest")}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="rounded-3xl border-orange-950/10 shadow-xl">
              <Tabs defaultValue="login">
                <TabsList className="m-6 mb-0 grid w-auto grid-cols-2">
                  <TabsTrigger value="login">{tk("signIn")}</TabsTrigger>
                  <TabsTrigger value="register">{tk("createAccount")}</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <CardHeader>
                    <CardTitle>{tk("welcomeBack")}</CardTitle>
                    <CardDescription>{tk("signInWithEmail")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={login} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">{tk("email")}</Label>
                        <Input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="login-password">{tk("password")}</Label>
                          <button
                            type="button"
                            onClick={reset}
                            className="text-xs text-orange-700 hover:underline"
                          >
                            {tk("forgotPassword")}
                          </button>
                        </div>
                        <Input
                          id="login-password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <Button disabled={busy} className="w-full">
                        {busy && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {tk("signIn")}
                      </Button>
                    </form>
                  </CardContent>
                </TabsContent>
                <TabsContent value="register">
                  <CardHeader>
                    <CardTitle>{tk("createYourAccount")}</CardTitle>
                    <CardDescription>{tk("profileFollowsDevices")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={register} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">{tk("displayName")}</Label>
                        <Input
                          id="register-name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">{tk("email")}</Label>
                        <Input
                          id="register-email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">{tk("password")}</Label>
                        <Input
                          id="register-password"
                          type="password"
                          autoComplete="new-password"
                          minLength={8}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          {tk("minEightChars")}
                        </p>
                      </div>
                      <Button disabled={busy} className="w-full">
                        {busy && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {tk("createAccount")}
                      </Button>
                    </form>
                  </CardContent>
                </TabsContent>
                <CardFooter className="flex-col gap-3 border-t pt-5">
                  <Button variant="ghost" onClick={finish} className="w-full">
                    {tk("continueAsGuest")}
                  </Button>
                  <p className="flex items-center text-[11px] text-muted-foreground">
                    <Mail className="mr-1 h-3 w-3" />
                    {tk("emailConfirmationNote")}
                  </p>
                </CardFooter>
              </Tabs>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
