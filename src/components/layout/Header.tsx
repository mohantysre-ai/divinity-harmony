import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/theme-context';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Moon, 
  Sun,
  Home,
  BookOpen,
  Video,
  Music,
  FileText,
  Settings,
  LogIn,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Mantras', href: '/mantras', icon: BookOpen },
  { name: 'Live Darshan', href: '/darshan', icon: Video },
  { name: 'MP3 Player', href: '/mp3-player', icon: Music },
  { name: 'Sacred Texts', href: '/pdf-reader', icon: FileText },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  
  // Check if user is logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
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
                Divinity Harmony
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            <div className="bg-muted/50 rounded-full px-1 py-1 flex items-center mr-2">
              {Navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive 
                        ? 'bg-background text-primary shadow-sm'
                        : 'text-foreground/70 hover:text-primary hover:bg-background/50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            {/* Notification icon */}
            <Button variant="ghost" size="icon" className="mr-1 text-foreground/70 hover:text-primary">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="mr-2 text-foreground/70 hover:text-primary"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          
            {/* User account menu */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2 hover:bg-background/80">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://i.pravatar.cc/150?img=30" />
                      <AvatarFallback>DH</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-xs">
                      <span className="font-medium">Devotee</span>
                      <span className="text-muted-foreground">User</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
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
                <span>Login</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-foreground/70"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {isLoggedIn ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=30" />
                <AvatarFallback>DH</AvatarFallback>
              </Avatar>
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
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/90 backdrop-blur border-b border-border/40 animate-in slide-in-from-top-5">
          <div className="container space-y-1 py-3">
            {Navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                    isActive 
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50 hover:text-accent-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
            <Link
              to="/settings"
              className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-accent/50 hover:text-accent-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
            {isLoggedIn && (
              <Button 
                variant="ghost" 
                className="w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
