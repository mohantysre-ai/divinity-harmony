import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simulate splash screen loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login - in a real app, this would be an API call
    if (username && password) {
      // Set login status in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "Login Successful",
        description: "Welcome to Divinity Harmony!",
      });
      if (onComplete) onComplete();
      navigate('/');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter your username and password.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock registration - in a real app, this would be an API call
    if (username && password && email) {
      // Set login status in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created and you're now logged in.",
      });
      if (onComplete) onComplete();
      navigate('/');
    } else {
      toast({
        title: "Registration Failed",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };
  
  const handleGuestAccess = () => {
    toast({
      title: "Guest Access",
      description: "You're browsing as a guest. Some features may be limited.",
    });
    if (onComplete) onComplete();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-950 via-amber-900 to-rose-950">
        <div className="absolute inset-0 bg-gradient-to-b from-hindu-red/70 to-hindu-orange/70 mix-blend-multiply"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse border-2 border-white/30">
              <span className="text-white text-5xl font-bold drop-shadow-lg">ॐ</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in">
            Divinity Harmony
          </h1>
          <p className="text-xl text-white/90 drop-shadow max-w-md mx-auto">
            Your Gateway to Spiritual Consciousness
          </p>
          <div className="mt-10">
            <div className="animate-pulse flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Decorative */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-orange-950 via-amber-900 to-rose-950 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-hindu-red/70 to-hindu-orange/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center mb-8 border border-white/30">
              <span className="text-white text-4xl font-bold">ॐ</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Divinity Harmony</h1>
            <p className="text-xl text-white/90 max-w-md">
              Begin your spiritual journey. Connect with ancient wisdom and find inner peace.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10">
                <h3 className="text-white font-medium">Sacred Mantras</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10">
                <h3 className="text-white font-medium">Live Darshans</h3>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10">
                <h3 className="text-white font-medium">Sacred Texts</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-hindu-red to-hindu-orange rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">ॐ</span>
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hindu-red to-hindu-gold">Divinity Harmony</h1>
            <p className="text-muted-foreground">Connect with your spiritual self</p>
          </div>
          
          <Card className="shadow-xl border-muted/30">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your spiritual journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username" 
                        className="border-muted/60 focus-visible:ring-hindu-red/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-xs text-hindu-red hover:underline">Forgot password?</a>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" 
                        className="border-muted/60 focus-visible:ring-hindu-red/50"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember-me" 
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <Label htmlFor="remember-me" className="text-sm text-muted-foreground">
                        Remember me for 30 days
                      </Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-hindu-red to-hindu-orange hover:from-hindu-red/90 hover:to-hindu-orange/90 transition-all"
                    >
                      Sign in
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="register">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">Create Account</CardTitle>
                  <CardDescription>
                    Begin your spiritual journey with us
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com" 
                        className="border-muted/60 focus-visible:ring-hindu-orange/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username-register">Username</Label>
                      <Input 
                        id="username-register" 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username" 
                        className="border-muted/60 focus-visible:ring-hindu-orange/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">Password</Label>
                      <Input 
                        id="password-register" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password" 
                        className="border-muted/60 focus-visible:ring-hindu-orange/50"
                      />
                      <p className="text-xs text-muted-foreground">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the <a href="#" className="text-hindu-red hover:underline">Terms of Service</a> and <a href="#" className="text-hindu-red hover:underline">Privacy Policy</a>
                      </Label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-hindu-orange to-hindu-gold hover:from-hindu-orange/90 hover:to-hindu-gold/90 transition-all"
                    >
                      Create account
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
              
              <CardFooter className="flex justify-center pt-2 pb-4">
                <Button variant="link" onClick={handleGuestAccess} className="text-muted-foreground hover:text-foreground">
                  Continue as Guest
                </Button>
              </CardFooter>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen; 