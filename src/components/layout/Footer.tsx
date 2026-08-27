import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Settings, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  const supportUrl = import.meta.env.VITE_SUPPORT_URL?.trim();
  return (
    <footer className="bg-muted/30 border-t border-muted pt-16 pb-8">
      <div className="container px-4 mx-auto">
        {/* Newsletter signup */}
        <div className="max-w-3xl mx-auto mb-16 bg-gradient-to-r from-hindu-red/10 to-hindu-gold/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Receive updates on new mantras, upcoming live darshans, and spiritual wisdom directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-background border-border/50 focus-visible:ring-hindu-red/50"
            />
            <Button className="bg-gradient-to-r from-hindu-red to-hindu-orange hover:brightness-110 transition-all">
              Subscribe
            </Button>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-hindu-red to-hindu-orange rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">ॐ</span>
              </div>
              <span className="text-lg font-bold">Divinity Harmony</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Connecting souls through ancient mantras, live darshans, and spiritual knowledge for a harmonious life.
            </p>
            <div className="flex space-x-3 pt-2">
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-muted-foreground/20 hover:bg-hindu-red/10 hover:text-hindu-red hover:border-hindu-red/50">
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-muted-foreground/20 hover:bg-hindu-red/10 hover:text-hindu-red hover:border-hindu-red/50">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-muted-foreground/20 hover:bg-hindu-red/10 hover:text-hindu-red hover:border-hindu-red/50">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9 border-muted-foreground/20 hover:bg-hindu-red/10 hover:text-hindu-red hover:border-hindu-red/50">
                <Youtube size={18} />
                <span className="sr-only">Youtube</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <span className="h-0.5 w-0 bg-hindu-red group-hover:w-2 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/mantras" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <span className="h-0.5 w-0 bg-hindu-red group-hover:w-2 transition-all duration-300"></span>
                  Mantras
                </Link>
              </li>
              <li>
                <Link to="/darshan" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <span className="h-0.5 w-0 bg-hindu-red group-hover:w-2 transition-all duration-300"></span>
                  Live Darshan
                </Link>
              </li>
              <li>
                <Link to="/scriptures" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <span className="h-0.5 w-0 bg-hindu-red group-hover:w-2 transition-all duration-300"></span>
                  Sacred Texts
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
                  <span className="h-0.5 w-0 bg-hindu-red group-hover:w-2 transition-all duration-300"></span>
                  Settings
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4 tracking-wide">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/deities" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Deity Encyclopedia
                </Link>
              </li>
              <li>
                <Link to="/temples" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Temple Locator
                </Link>
              </li>
              <li>
                <Link to="/priests" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Priest & Puja Directory
                </Link>
              </li>
              {supportUrl && <li>
                <a href={supportUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Support Divinity Harmony <ExternalLink className="ml-1 h-3 w-3 inline" />
                </a>
              </li>}
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4 tracking-wide">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground group">
                <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center text-hindu-red border border-border/30 group-hover:bg-hindu-red/10 transition-colors">
                  <Mail size={14} />
                </div>
                <span>contact@divinityharmony.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground group">
                <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center text-hindu-red border border-border/30 group-hover:bg-hindu-red/10 transition-colors">
                  <Phone size={14} />
                </div>
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground group">
                <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center text-hindu-red border border-border/30 group-hover:bg-hindu-red/10 transition-colors mt-0.5">
                  <MapPin size={14} />
                </div>
                <span>Divine Harmony Center,<br />Spiritual Avenue, Peace City</span>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8 opacity-40" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Divinity Harmony. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-hindu-red fill-hindu-red" />
            <span>for a spiritual world</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
