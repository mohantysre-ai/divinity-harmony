import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/theme-context";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Moon,
  Sun,
  Home,
  BookOpen,
  Video,
  FileText,
  Settings,
  LogIn,
  LogOut,
  Bell,
  Landmark,
  MapPin,
  Users,
  Languages,
  Accessibility,
  Compass,
  Sparkles,
  Library,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { localeOptions, useLocale } from "@/hooks/use-locale";
import type { UiKey } from "@/lib/ui-keys";
import { BRAND_NAME } from "@/lib/brand";

const Navigation: { key: UiKey; href: string; icon: typeof Home }[] = [
  { key: "home", href: "/", icon: Home },
  { key: "mantras", href: "/mantras", icon: BookOpen },
  { key: "liveDarshan", href: "/darshan", icon: Video },
  { key: "scriptures", href: "/scriptures", icon: FileText },
  { key: "deities", href: "/deities", icon: Landmark },
  { key: "temples", href: "/temples", icon: MapPin },
  { key: "priests", href: "/priests", icon: Users },
];
const MoreNavigation: { key: UiKey; href: string; icon: typeof Sparkles }[] = [
  { key: "myDharma", href: "/my-dharma", icon: Sparkles },
  { key: "cultureOfIndia", href: "/culture", icon: Landmark },
  { key: "pravachanReading", href: "/wisdom", icon: Library },
  { key: "vedicAstrology", href: "/astrology", icon: Compass },
];
const desktopNavItemClass =
  "flex h-9 w-[clamp(4.625rem,5.8vw,5.75rem)] min-w-0 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-medium transition-all duration-200";

const Header = () => {
  const { locale, setLocale, tk, detectedState, elderMode, setElderMode } =
    useLocale();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isMoreNavigationActive = MoreNavigation.some(
    (item) => location.pathname === item.href,
  );

  const displayName = String(
    user?.user_metadata?.display_name ||
      user?.email?.split("@")[0] ||
      tk("devotee"),
  );
  const avatarUrl = String(user?.user_metadata?.avatar_url || "");
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: tk("loggedOut"),
      description: tk("loggedOutSuccess"),
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/70 border-b border-border/40 shadow-sm">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between py-3">
          <div className="min-w-0 flex-none">
            <Link to="/" className="flex flex-none items-center gap-2.5" aria-label={BRAND_NAME}>
              <img
                src="/dharmdisha-icon.svg"
                alt=""
                aria-hidden="true"
                className="h-10 w-10 flex-none rounded-xl shadow-lg"
              />
              <span data-no-regionalize className="flex-none whitespace-nowrap bg-gradient-to-r from-hindu-red to-hindu-gold bg-clip-text text-lg font-bold leading-none text-transparent sm:text-xl md:text-2xl">
                {BRAND_NAME}
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden xl:flex xl:items-center xl:gap-1">
            <div className="mr-2 flex items-center gap-0.5 rounded-full border border-border/60 bg-muted/50 p-1 shadow-inner">
              {Navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    title={tk(item.key)}
                    className={`${desktopNavItemClass} ${
                      isActive
                        ? "bg-background text-primary shadow-sm"
                        : "text-foreground/70 hover:text-primary hover:bg-background/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-none" />
                    <span className="min-w-0 truncate whitespace-nowrap">
                      {tk(item.key)}
                    </span>
                  </Link>
                );
              })}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    title={tk("explore")}
                    className={`${desktopNavItemClass} ${
                      isMoreNavigationActive
                        ? "bg-background text-primary shadow-sm"
                        : "text-foreground/70 hover:bg-background/50 hover:text-primary"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 flex-none" />
                    <span className="min-w-0 truncate whitespace-nowrap">
                      {tk("explore")}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 flex-none opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-64">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    {tk("explore")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {MoreNavigation.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link to={item.href} className="flex items-center py-2.5">
                        <item.icon className="mr-2 h-4 w-4" />
                        {tk(item.key)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notification icon */}
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 text-foreground/70 hover:text-primary"
            >
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  title={
                    detectedState
                      ? tk("detectedStateTemplate", { state: detectedState })
                      : tk("language")
                  }
                >
                  <Languages className="mr-1.5 h-4 w-4" />
                  {localeOptions.find((x) => x.id === locale)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="max-h-80 overflow-auto"
              >
                <DropdownMenuLabel>{tk("applicationLanguage")}</DropdownMenuLabel>
                {localeOptions.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => setLocale(item.id)}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant={elderMode ? "default" : "ghost"}
              size="icon"
              onClick={() => setElderMode(!elderMode)}
              title={tk("elderMode")}
            >
              <Accessibility className="h-5 w-5" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="mr-2 text-foreground/70 hover:text-primary"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">{tk("toggleTheme")}</span>
            </Button>

            {/* User account menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 px-2 hover:bg-background/80"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-xs">
                      <span className="max-w-24 truncate font-medium">
                        {displayName}
                      </span>
                      <span className="text-muted-foreground">{tk("signedIn")}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{tk("myAccount")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="flex items-center cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{tk("settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{tk("logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleLogin}
                className="flex items-center gap-1 bg-gradient-to-r from-hindu-red to-hindu-orange hover:brightness-110"
              >
                <LogIn className="h-4 w-4" />
                <span>{tk("login")}</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 xl:hidden">
            <Button
              variant={elderMode ? "default" : "ghost"}
              size="icon"
              onClick={() => setElderMode(!elderMode)}
              aria-label={tk("elderMode")}
              className="hidden sm:inline-flex"
            >
              <Accessibility className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden text-foreground/70 sm:inline-flex"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <Link to="/settings" className="hidden min-[420px]:block">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleLogin}
                className="hidden bg-gradient-to-r from-hindu-red to-hindu-orange min-[420px]:inline-flex"
              >
                <LogIn className="h-4 w-4 mr-1" />
                {tk("login")}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground/70"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-background/90 backdrop-blur border-b border-border/40 animate-in slide-in-from-top-5">
          <div className="container space-y-1 py-3">
            {Navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 hover:text-accent-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {tk(item.key)}
                </Link>
              );
            })}
            <div className="mt-2 border-t pt-2">
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                {tk("explore")}
                <ChevronDown className="ml-auto h-4 w-4" />
              </div>
              <div className="ml-4 border-l pl-2">
                {MoreNavigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {tk(item.key)}
                  </Link>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 border-y py-3">
              {localeOptions.map((item) => (
                <Button
                  key={item.id}
                  size="sm"
                  variant={locale === item.id ? "default" : "outline"}
                  onClick={() => setLocale(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            <Link
              to="/settings"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent/50 hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="h-5 w-5 mr-3" />
              {tk("settings")}
            </Link>
            {!user && (
              <Button
                variant="ghost"
                className="w-full justify-start rounded-lg px-3 py-2.5 text-sm font-medium min-[420px]:hidden"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogin();
                }}
              >
                <LogIn className="mr-3 h-5 w-5" />
                {tk("login")}
              </Button>
            )}
            {user && (
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5 mr-3" />
                {tk("logout")}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
