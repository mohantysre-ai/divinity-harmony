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

const Navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Mantras", href: "/mantras", icon: BookOpen },
  { name: "Live Darshan", href: "/darshan", icon: Video },
  { name: "Scriptures", href: "/scriptures", icon: FileText },
  { name: "Deities", href: "/deities", icon: Landmark },
  { name: "Temples", href: "/temples", icon: MapPin },
  { name: "Priests", href: "/priests", icon: Users },
];
const MoreNavigation = [
  { name: "My Dharma", href: "/my-dharma", icon: Sparkles },
  { name: "Culture of India", href: "/culture", icon: Landmark },
  { name: "Pravachan & Reading", href: "/wisdom", icon: Library },
  { name: "Vedic Astrology", href: "/astrology", icon: Compass },
];

const Header = () => {
  const { locale, setLocale, t, ui, detectedState, elderMode, setElderMode } =
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
      "Devotee",
  );
  const avatarUrl = String(user?.user_metadata?.avatar_url || "");
  const initials = displayName.slice(0, 2).toUpperCase();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: ui("Logged Out"),
      description: ui("You have been successfully logged out."),
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
                {ui("Divinity Harmony")}
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
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-background text-primary shadow-sm"
                        : "text-foreground/70 hover:text-primary hover:bg-background/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {t(
                      item.name === "Live Darshan"
                        ? "darshan"
                        : item.name.toLowerCase(),
                    )}
                  </Link>
                );
              })}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {ui("Explore")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {MoreNavigation.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {ui(item.name)}
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
                    detectedState ? `Detected: ${detectedState}` : t("language")
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
                <DropdownMenuLabel>{ui("Application language")}</DropdownMenuLabel>
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
              title={ui("Elder Mode")}
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
              <span className="sr-only">Toggle theme</span>
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
                      <span className="text-muted-foreground">Signed in</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="flex items-center cursor-pointer"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{ui("Settings")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{ui("Logout")}</span>
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
                <span>{t("login")}</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 xl:hidden">
            <Button
              variant={elderMode ? "default" : "ghost"}
              size="icon"
              onClick={() => setElderMode(!elderMode)}
              aria-label="Elder Mode"
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
                Login
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
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 hover:text-accent-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {t(
                    item.name === "Live Darshan"
                      ? "darshan"
                      : item.name.toLowerCase(),
                  )}
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
                {ui(item.name)}
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
              {t("settings")}
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
                {ui("Logout")}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
