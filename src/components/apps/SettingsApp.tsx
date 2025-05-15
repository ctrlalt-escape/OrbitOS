
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { User, Settings, Shield, Bell, Palette, Monitor, Lock, Info } from 'lucide-react';
import { useOrbitOS } from '@/context/OrbitOSContext';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

type Settings = {
  appearance: {
    theme: string;
    accentColor: string;
    fontSize: number;
  };
  notifications: {
    emailNotifications: boolean;
    soundEffects: boolean;
    showNotifications: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    autoLock: boolean;
    lockAfterMinutes: number;
  };
  about: {
    version: string;
    buildNumber: string;
    lastUpdated: string;
  };
};

const SettingsApp = () => {
  const { user, logout } = useOrbitOS();
  const [settings, setSettings] = useState<Settings>({
    appearance: {
      theme: 'system',
      accentColor: '#33c3f0',
      fontSize: 16
    },
    notifications: {
      emailNotifications: true,
      soundEffects: true,
      showNotifications: true
    },
    security: {
      twoFactorAuth: false,
      autoLock: true,
      lockAfterMinutes: 5
    },
    about: {
      version: '1.0.0',
      buildNumber: '2023.5.12',
      lastUpdated: '2025-05-14'
    }
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('orbit-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Failed to parse saved settings', err);
      }
    }
  }, []);

  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('orbit-settings', JSON.stringify(newSettings));
    toast.success('Settings saved');
  };

  const handleAppearanceChange = (key: keyof typeof settings.appearance, value: any) => {
    const newSettings = {
      ...settings,
      appearance: {
        ...settings.appearance,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  const handleNotificationsChange = (key: keyof typeof settings.notifications, value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  const handleSecurityChange = (key: keyof typeof settings.security, value: any) => {
    const newSettings = {
      ...settings,
      security: {
        ...settings.security,
        [key]: value
      }
    };
    saveSettings(newSettings);
  };

  return (
    <div className="h-full flex">
      <Tabs defaultValue="general" className="w-full">
        {/* Sidebar with tab buttons */}
        <div className="w-56 border-r h-full bg-gray-50">
          <div className="p-4 border-b">
            <h2 className="font-medium">Settings</h2>
          </div>
          <ScrollArea className="h-[calc(100%-57px)]">
            <TabsList className="flex flex-col w-full p-0 bg-transparent h-auto">
              <TabsTrigger value="general" className="w-full justify-start px-4 py-2 h-9 data-[state=active]:bg-gray-200">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="appearance" className="w-full justify-start px-4 py-2 h-9 data-[state=active]:bg-gray-200">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full justify-start px-4 py-2 h-9 data-[state=active]:bg-gray-200">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="w-full justify-start px-4 py-2 h-9 data-[state=active]:bg-gray-200">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="about" className="w-full justify-start px-4 py-2 h-9 data-[state=active]:bg-gray-200">
                <Info className="h-4 w-4 mr-2" />
                About
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </div>

        {/* Settings content */}
        <div className="flex-1 overflow-auto">
          {/* Account Settings */}
          <TabsContent value="general" className="p-6 m-0 h-full">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
              
              <div className="mb-8 flex items-center">
                <img 
                  src={user?.avatar} 
                  alt={user?.username} 
                  className="h-20 w-20 rounded-full mr-6"
                />
                <div>
                  <h3 className="text-lg font-medium">{user?.username}</h3>
                  <p className="text-gray-500">User ID: {user?.id}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <Button variant="outline" size="sm">Change Avatar</Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" value={user?.username} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value="user@example.com" disabled />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => toast.info("Password changes are disabled in this demo")}
                  >
                    Change Password
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={logout}
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance" className="p-6 m-0 h-full">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Appearance</h2>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="flex gap-4">
                    <Button 
                      variant={settings.appearance.theme === 'light' ? 'default' : 'outline'}
                      className="flex-1" 
                      onClick={() => handleAppearanceChange('theme', 'light')}
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button 
                      variant={settings.appearance.theme === 'dark' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => handleAppearanceChange('theme', 'dark')}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button 
                      variant={settings.appearance.theme === 'system' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => handleAppearanceChange('theme', 'system')}
                    >
                      <Laptop className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Accent Color</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {['#33c3f0', '#8b5cf6', '#ef4444', '#22c55e', '#f97316', '#ec4899'].map((color) => (
                      <button
                        key={color}
                        className={`w-full aspect-square rounded-md ${
                          settings.appearance.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleAppearanceChange('accentColor', color)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Font Size: {settings.appearance.fontSize}px</Label>
                  </div>
                  <Slider
                    value={[settings.appearance.fontSize]}
                    min={12}
                    max={24}
                    step={1}
                    onValueChange={(value) => handleAppearanceChange('fontSize', value[0])}
                  />
                </div>
                
                <div className="pt-4">
                  <Button onClick={() => toast.success("Appearance settings saved")}>
                    Save Appearance Settings
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Notifications Settings */}
          <TabsContent value="notifications" className="p-6 m-0 h-full">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Notifications</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <p className="text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.emailNotifications} 
                    onCheckedChange={(checked) => handleNotificationsChange('emailNotifications', checked)} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Sound Effects</h3>
                    <p className="text-gray-500">Play sounds when receiving notifications</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.soundEffects} 
                    onCheckedChange={(checked) => handleNotificationsChange('soundEffects', checked)} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Show Notifications</h3>
                    <p className="text-gray-500">Display notification popups</p>
                  </div>
                  <Switch 
                    checked={settings.notifications.showNotifications} 
                    onCheckedChange={(checked) => handleNotificationsChange('showNotifications', checked)} 
                  />
                </div>
                
                <div className="pt-6">
                  <Button 
                    onClick={() => {
                      toast.success("Notification settings saved");
                      // Try showing a test notification if enabled
                      if (settings.notifications.showNotifications) {
                        setTimeout(() => {
                          toast.info("Test Notification", {
                            description: "This is a test notification"
                          });
                        }, 1000);
                      }
                    }}
                  >
                    Save Notification Settings
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="p-6 m-0 h-full">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6">Security</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch 
                    checked={settings.security.twoFactorAuth} 
                    onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Auto Lock</h3>
                    <p className="text-gray-500">Automatically lock the system after inactivity</p>
                  </div>
                  <Switch 
                    checked={settings.security.autoLock} 
                    onCheckedChange={(checked) => handleSecurityChange('autoLock', checked)} 
                  />
                </div>
                
                {settings.security.autoLock && (
                  <div className="pl-6 space-y-3">
                    <Label>Lock after inactivity (minutes)</Label>
                    <Select 
                      value={String(settings.security.lockAfterMinutes)} 
                      onValueChange={(value) => handleSecurityChange('lockAfterMinutes', parseInt(value))}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 minute</SelectItem>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="10">10 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="pt-6">
                  <Button onClick={() => toast.success("Security settings saved")}>
                    Save Security Settings
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* About */}
          <TabsContent value="about" className="p-6 m-0 h-full">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-orbit-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-white"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-1">OrbitOS</h2>
                  <p className="text-gray-500">Version {settings.about.version}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Version</span>
                  <span>{settings.about.version}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Build Number</span>
                  <span>{settings.about.buildNumber}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Last Updated</span>
                  <span>{settings.about.lastUpdated}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="mb-4">OrbitOS is a web-based operating system simulation</p>
                <p className="text-sm text-gray-500">
                  Created by Lovable.dev. All rights reserved.
                </p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

// Define missing components referenced in the code
const Moon = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

const Laptop = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>
  </svg>
);

export default SettingsApp;
