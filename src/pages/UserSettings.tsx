import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/hooks/use-theme';
import { useTheme } from '@/hooks/theme-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { deviceHeaders } from '@/lib/device';

const UserSettings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // State for user settings
  const [name, setName] = useState('');
  const [gotra, setGotra] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [autoplay, setAutoplay] = useState(false);
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    void fetch('/api/profile', { headers: deviceHeaders() }).then((response) => response.json()).then((profile) => {
      setName(profile.name || ''); setGotra(profile.gotra || ''); setLanguage(profile.language || 'english');
    }).catch(() => undefined);
    setAutoplay(localStorage.getItem('preference:autoplay') === 'true');
    setNotifications(localStorage.getItem('preference:notifications') !== 'false');
  }, []);
  
  // Form submission handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/profile', { method: 'POST', headers: deviceHeaders(), body: JSON.stringify({ name, gotra, language }) });
    toast({
      title: response.ok ? "Profile Updated" : "Unable to save",
      description: response.ok ? "Your profile is saved to this device identity." : "Please try again.",
    });
  };
  
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('preference:autoplay', String(autoplay));
    localStorage.setItem('preference:notifications', String(notifications));
    toast({
      title: "Preferences Updated",
      description: "Your preferences have been saved.",
    });
  };

  return (
    <ThemeProvider>
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">User Settings</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and how others see you on the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gotra">Gotra or family tradition (optional)</Label>
                      <Input 
                        id="gotra"
                        value={gotra}
                        onChange={(e) => setGotra(e.target.value)}
                        placeholder="Enter only if known"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="sanskrit">Sanskrit</SelectItem>
                          <SelectItem value="tamil">Tamil</SelectItem>
                          <SelectItem value="telugu">Telugu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button type="submit">Save Profile</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance & Preferences</CardTitle>
                  <CardDescription>
                    Customize how the application looks and behaves.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSavePreferences} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="theme">Dark Theme</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable dark mode for a comfortable viewing experience in low light.
                          </p>
                        </div>
                        <Switch 
                          id="theme"
                          checked={theme === 'dark'}
                          onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="autoplay">Autoplay Media</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically play audio and video content when available.
                          </p>
                        </div>
                        <Switch 
                          id="autoplay"
                          checked={autoplay}
                          onCheckedChange={setAutoplay}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit">Save Preferences</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Manage your notification preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notifications">Enable Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about new content and events.
                          </p>
                        </div>
                        <Switch 
                          id="notifications"
                          checked={notifications}
                          onCheckedChange={setNotifications}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between opacity-50" style={{ pointerEvents: notifications ? 'auto' : 'none' }}>
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates via email.
                          </p>
                        </div>
                        <Switch 
                          id="email-notifications"
                          checked={notifications}
                          onCheckedChange={setNotifications}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit">Save Notification Settings</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default UserSettings;
