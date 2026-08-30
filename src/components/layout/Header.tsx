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

const Header = () => {
  const { locale, setLocale, tk, detectedState, elderMode, setElderMode } =
    useLocale();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

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
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-hindu-red to-hindu-orange rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">ॐ</span>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hindu-red to-hindu-gold">
                {tk("divinityHarmony")}
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden xl:flex xl:items-center xl:gap-1">
            <div className="bg-muted/50 rounded-full px-1 py-1 flex items-center mr-2">
              {Navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-background text-primary shadow-sm"
                        : "text-foreground/70 hover:text-primary hover:bg-background/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {tk(item.key)}
                  </Link>
                );
              })}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {tk("explore")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {MoreNavigation.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {tk(item.key)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
            >
              <Accessibility className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground/70"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <Link to="/settings">
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
                className="bg-gradient-to-r from-hindu-red to-hindu-orange"
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
