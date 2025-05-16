
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Volume2, 
  Wifi, 
  Bluetooth, 
  Moon, 
  Sun, 
  Battery, 
  Settings,
  User,
  Bell,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';
import { useOrbitOS } from '@/context/OrbitOSContext';

const QuickSettings = () => {
  const { logout } = useOrbitOS();
  const [volume, setVolume] = useState(70);
  const [brightness, setBrightness] = useState(80);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [batteryLevel] = useState(85);

  const handleLogout = () => {
    toast.info('Logging out...');
    setTimeout(logout, 1000);
  };

  const handleToggleWifi = () => {
    const newState = !wifi;
    setWifi(newState);
    toast.info(newState ? 'Wi-Fi turned on' : 'Wi-Fi turned off');
  };

  const handleToggleBluetooth = () => {
    const newState = !bluetooth;
    setBluetooth(newState);
    toast.info(newState ? 'Bluetooth turned on' : 'Bluetooth turned off');
  };

  const handleToggleDarkMode = () => {
    const newState = !darkMode;
    setDarkMode(newState);
    toast.info(newState ? 'Dark mode enabled' : 'Light mode enabled');
    // In a real implementation, we would update the theme here
  };

  const handleToggleDoNotDisturb = () => {
    const newState = !doNotDisturb;
    setDoNotDisturb(newState);
    toast.info(newState ? 'Do not disturb enabled' : 'Do not disturb disabled');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white">
          <Bell size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 border-navy-700 bg-navy-900 text-white" 
        align="end"
        sideOffset={5}
      >
        <div className="p-3 border-b border-navy-800">
          <h3 className="font-medium mb-1">Quick Settings</h3>
          <p className="text-xs text-white/70">Control system settings</p>
        </div>
        
        <div className="p-3 grid grid-cols-4 gap-2 border-b border-navy-800">
          <Button
            variant="outline"
            size="sm"
            className={`flex-col h-auto aspect-square p-2 border-navy-700 ${wifi ? 'bg-navy-700' : 'bg-navy-800'}`}
            onClick={handleToggleWifi}
          >
            <Wifi size={18} />
            <span className="text-xs mt-1">Wi-Fi</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={`flex-col h-auto aspect-square p-2 border-navy-700 ${bluetooth ? 'bg-navy-700' : 'bg-navy-800'}`}
            onClick={handleToggleBluetooth}
          >
            <Bluetooth size={18} />
            <span className="text-xs mt-1">Bluetooth</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={`flex-col h-auto aspect-square p-2 border-navy-700 ${darkMode ? 'bg-navy-700' : 'bg-navy-800'}`}
            onClick={handleToggleDarkMode}
          >
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            <span className="text-xs mt-1">Dark</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className={`flex-col h-auto aspect-square p-2 border-navy-700 ${doNotDisturb ? 'bg-navy-700' : 'bg-navy-800'}`}
            onClick={handleToggleDoNotDisturb}
          >
            <Bell size={18} />
            <span className="text-xs mt-1">DND</span>
          </Button>
        </div>
        
        <div className="p-3 space-y-4 border-b border-navy-800">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm flex items-center">
                <Volume2 size={16} className="mr-2" />
                Volume
              </label>
              <span className="text-xs text-white/70">{volume}%</span>
            </div>
            <Slider 
              value={[volume]} 
              onValueChange={(value) => setVolume(value[0])} 
              max={100} 
              step={1}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm flex items-center">
                <Sun size={16} className="mr-2" />
                Brightness
              </label>
              <span className="text-xs text-white/70">{brightness}%</span>
            </div>
            <Slider 
              value={[brightness]} 
              onValueChange={(value) => setBrightness(value[0])} 
              max={100} 
              step={1}
            />
          </div>
        </div>
        
        <div className="p-3 border-b border-navy-800">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Battery size={16} className="mr-2" />
              <span className="text-sm">Battery</span>
            </div>
            <span className="text-white/70 text-xs">{batteryLevel}%</span>
          </div>
          <div className="w-full h-1.5 bg-navy-800 rounded-full">
            <div
              className={`h-full rounded-full ${
                batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
        </div>
        
        <div className="p-3 flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-white hover:bg-navy-800"
            onClick={() => toast.info('Settings opened')}
          >
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-white hover:bg-navy-800"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default QuickSettings;
