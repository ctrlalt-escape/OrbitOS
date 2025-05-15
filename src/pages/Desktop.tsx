
import { useState, useEffect } from 'react';
import { useOrbitOS } from '../context/OrbitOSContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Settings, LogOut, Clock, Wifi, Battery, Volume2 } from 'lucide-react';
import WindowManager from '@/components/WindowManager';
import { toast } from 'sonner';
import AppMenu from '@/components/AppMenu';

// Import app components
import NotesApp from '@/components/apps/NotesApp';
import BrowserApp from '@/components/apps/BrowserApp';
import FilesApp from '@/components/apps/FilesApp';
import SettingsApp from '@/components/apps/SettingsApp';
import CalendarApp from '@/components/apps/CalendarApp';
import TerminalApp from '@/components/apps/TerminalApp';
import CalculatorApp from '@/components/apps/CalculatorApp';
import PhotosApp from '@/components/apps/PhotosApp';
import MailApp from '@/components/apps/MailApp';

// New Music App component
const MusicApp = () => (
  <div className="h-full flex flex-col bg-white">
    <div className="border-b p-3 flex justify-between items-center">
      <h2 className="text-lg font-medium">Music</h2>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">Browse</Button>
        <Button variant="ghost" size="sm">Library</Button>
      </div>
    </div>
    <div className="flex-1 p-4 overflow-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Recently Played</h3>
        <div className="grid grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-square bg-gray-100 rounded-md mb-2"></div>
              <span className="text-sm font-medium">Album {i+1}</span>
              <span className="text-xs text-gray-500">Artist {i+1}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Top Songs</h3>
        <div className="space-y-2">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
              <span className="w-6 text-center text-gray-500">{i+1}</span>
              <div className="ml-3">
                <div className="font-medium">Song Title {i+1}</div>
                <div className="text-xs text-gray-500">Artist Name</div>
              </div>
              <div className="ml-auto text-sm text-gray-500">3:45</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t p-2 flex items-center justify-between">
      <div className="text-sm">Now Playing: Nothing</div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="rounded-full">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5L19 12L5 19V5Z" fill="currentColor" />
          </svg>
        </Button>
      </div>
    </div>
  </div>
);

// New Weather App component
const WeatherApp = () => (
  <div className="h-full flex flex-col bg-white">
    <div className="border-b p-3 flex justify-between items-center">
      <h2 className="text-lg font-medium">Weather</h2>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm">Locations</Button>
        <Button variant="ghost" size="sm">Map</Button>
      </div>
    </div>
    <div className="flex-1 p-4 overflow-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-medium">San Francisco</h3>
        <div className="text-6xl font-light mt-2">72°</div>
        <div className="text-xl mt-1">Sunny</div>
        <div className="text-gray-500 mt-1">H:76° L:65°</div>
      </div>
      
      <div className="grid grid-cols-5 gap-4 my-8">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-sm font-medium">{day}</div>
            <div className="my-2">
              <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5" />
              </svg>
            </div>
            <div className="text-sm">{70 + i}°</div>
          </div>
        ))}
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Humidity</div>
            <div className="font-medium">62%</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Wind</div>
            <div className="font-medium">8 mph</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">Pressure</div>
            <div className="font-medium">1012 hPa</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-500">UV Index</div>
            <div className="font-medium">3 of 10</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Desktop = () => {
  const { user, logout, windows, openWindow, notifications, markNotificationAsRead } = useOrbitOS();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Register apps
  const apps = [
    { 
      id: 'notes', 
      name: 'Notes', 
      icon: '/apps/notes.svg', 
      component: <NotesApp /> 
    },
    { 
      id: 'browser', 
      name: 'Browser', 
      icon: '/apps/browser.svg', 
      component: <BrowserApp /> 
    },
    { 
      id: 'files', 
      name: 'Files', 
      icon: '/apps/files.svg', 
      component: <FilesApp /> 
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: '/apps/settings.svg', 
      component: <SettingsApp /> 
    },
    { 
      id: 'calendar', 
      name: 'Calendar', 
      icon: '/apps/calendar.svg', 
      component: <CalendarApp /> 
    },
    { 
      id: 'terminal', 
      name: 'Terminal', 
      icon: '/apps/terminal.svg', 
      component: <TerminalApp /> 
    },
    { 
      id: 'calculator', 
      name: 'Calculator', 
      icon: 'https://cdn-icons-png.flaticon.com/512/2374/2374370.png', 
      component: <CalculatorApp /> 
    },
    { 
      id: 'photos', 
      name: 'Photos', 
      icon: 'https://cdn-icons-png.flaticon.com/512/1088/1088537.png', 
      component: <PhotosApp /> 
    },
    { 
      id: 'mail', 
      name: 'Mail', 
      icon: 'https://cdn-icons-png.flaticon.com/512/561/561127.png', 
      component: <MailApp /> 
    },
    { 
      id: 'music', 
      name: 'Music', 
      icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111624.png', 
      component: <MusicApp /> 
    },
    { 
      id: 'weather', 
      name: 'Weather', 
      icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png', 
      component: <WeatherApp /> 
    }
  ];

  const handleLogout = () => {
    toast.info('Logging out...');
    setTimeout(logout, 1000);
  };
  
  const handleOpenApp = (app: any) => {
    console.log('Opening app:', app.id);
    openWindow(app);
    setIsAppMenuOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Menu Bar (like macOS) */}
      <div className="h-8 bg-black/80 backdrop-blur-lg text-white flex items-center px-3 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10 rounded-md p-1 h-auto"
              onClick={() => setIsAppMenuOpen(!isAppMenuOpen)}
            >
              <svg className="h-5 w-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 93.866667c230.4 0 418.133333 187.733333 418.133333 418.133333s-187.733333 418.133333-418.133333 418.133333S93.866667 742.4 93.866667 512 281.6 93.866667 512 93.866667z m0 746.666666c179.2 0 328.533333-149.333333 328.533333-328.533333S691.2 183.466667 512 183.466667 183.466667 332.8 183.466667 512s149.333333 328.533333 328.533333 328.533333z" fill="currentColor" />
              </svg>
            </Button>
            <span className="font-semibold ml-2">OrbitOS</span>
          </div>

          {/* Active app menu items - simplified */}
          <div className="flex items-center gap-3 text-sm">
            <span className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer">File</span>
            <span className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer">Edit</span>
            <span className="hover:bg-white/10 px-2 py-1 rounded cursor-pointer">View</span>
          </div>
        </div>

        {/* System Status Icons */}
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* User Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full p-0 h-6 w-6 overflow-hidden ml-2">
                <img 
                  src={user?.avatar} 
                  alt={user?.username} 
                  className="h-6 w-6 object-cover"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-56 p-0 border-gray-200 bg-white/90 backdrop-blur-md" 
              align="end"
              side="bottom"
              sideOffset={5}
            >
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img 
                    src={user?.avatar} 
                    alt={user?.username} 
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{user?.username}</h3>
                    <p className="text-xs text-gray-500">Logged in</p>
                  </div>
                </div>
              </div>
              <div className="p-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => handleOpenApp(apps.find(a => a.id === 'settings'))}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Log out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Desktop Area */}
      <div 
        className="flex-grow bg-gradient-to-b from-blue-600 to-purple-700 bg-cover bg-center relative"
      >
        {/* Dock */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-3 flex bg-white/10 backdrop-blur-lg rounded-2xl p-2 shadow-sm border border-white/10">
          {apps.slice(0, 8).map((app) => (
            <Tooltip key={app.id}>
              <TooltipTrigger asChild>
                <button 
                  className="app-icon-dock mx-1 transition-all hover:scale-110"
                  onClick={() => handleOpenApp(app)}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/10">
                    <img src={app.icon} alt={app.name} className="w-8 h-8" />
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{app.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          <div className="border-l border-white/10 mx-2 h-10"></div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={() => handleOpenApp(apps.find(a => a.id === 'settings'))} className="app-icon-dock mx-1 transition-all hover:scale-110">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/10">
                  <Settings className="w-7 h-7 text-white" />
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* App Menu */}
        {isAppMenuOpen && (
          <div className="absolute top-0 left-0 z-50 w-80 bg-black/70 backdrop-blur-xl text-white border border-white/10 rounded-md mt-8 ml-2 shadow-xl">
            <AppMenu apps={apps} onSelectApp={handleOpenApp} />
          </div>
        )}

        {/* Desktop Icons - Simplified grid */}
        <div className="p-6 grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-4">
          {apps.map((app) => (
            <button 
              key={app.id} 
              className="flex flex-col items-center group"
              onClick={() => handleOpenApp(app)}
            >
              <div className="app-icon-img w-14 h-14 flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-xl mb-2 group-hover:bg-white/10 transition-all border border-white/5">
                <img src={app.icon} alt={app.name} className="w-8 h-8" />
              </div>
              <span className="text-white text-xs font-medium bg-black/30 px-2 py-0.5 rounded-md backdrop-blur-sm max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        {/* Window Manager */}
        <WindowManager />
      </div>
    </div>
  );
};

export default Desktop;
