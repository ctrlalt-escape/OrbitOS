
import { useState, useEffect } from 'react';
import { useOrbitOS } from '../context/OrbitOSContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Settings, LogOut, Clock, Wifi, Battery, Volume2 } from 'lucide-react';
import WindowManager from '@/components/WindowManager';
import { toast } from 'sonner';
import AppMenu from '@/components/AppMenu';
import QuickSettings from '@/components/QuickSettings';

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
import MusicApp from '@/components/apps/MusicApp';
import WeatherApp from '@/components/apps/WeatherApp';
import CodeEditorApp from '@/components/apps/CodeEditorApp';
import ChatApp from '@/components/apps/ChatApp';
import MapsApp from '@/components/apps/MapsApp';
import StickyNotesApp from '@/components/apps/StickyNotesApp';
import AppStoreApp from '@/components/apps/AppStoreApp';
import GamesApp from '@/components/apps/GamesApp';
import VideoApp from '@/components/apps/VideoApp';

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
      id: 'stickynotes', 
      name: 'Sticky Notes', 
      icon: '/apps/stickynotes.svg', 
      component: <StickyNotesApp /> 
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
      icon: '/apps/calculator.svg', 
      component: <CalculatorApp /> 
    },
    { 
      id: 'photos', 
      name: 'Photos', 
      icon: '/apps/photos.svg', 
      component: <PhotosApp /> 
    },
    { 
      id: 'mail', 
      name: 'Mail', 
      icon: '/apps/mail.svg', 
      component: <MailApp /> 
    },
    { 
      id: 'music', 
      name: 'Music', 
      icon: '/apps/music.svg', 
      component: <MusicApp /> 
    },
    { 
      id: 'weather', 
      name: 'Weather', 
      icon: '/apps/weather.svg', 
      component: <WeatherApp /> 
    },
    { 
      id: 'code', 
      name: 'Code Editor', 
      icon: '/apps/code.svg', 
      component: <CodeEditorApp /> 
    },
    { 
      id: 'chat', 
      name: 'Chat', 
      icon: '/apps/chat.svg', 
      component: <ChatApp /> 
    },
    { 
      id: 'maps', 
      name: 'Maps', 
      icon: '/apps/maps.svg', 
      component: <MapsApp /> 
    },
    { 
      id: 'appstore', 
      name: 'App Store', 
      icon: '/apps/appstore.svg', 
      component: <AppStoreApp /> 
    },
    { 
      id: 'games', 
      name: 'Games', 
      icon: '/apps/games.svg', 
      component: <GamesApp /> 
    },
    { 
      id: 'video', 
      name: 'Video', 
      icon: '/apps/video.svg', 
      component: <VideoApp /> 
    }
  ];

  const handleLogout = () => {
    toast.info('Logging out...');
    setTimeout(logout, 1000);
  };
  
  const handleOpenApp = (app) => {
    console.log('Opening app:', app.id);
    openWindow(app);
    setIsAppMenuOpen(false);
  };

  // Calculate which apps are active (have open windows)
  const activeApps = windows.map(window => window.id);

  // ChromeOS style date formatting
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return currentTime.toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Menu Bar (like ChromeOS) */}
      <div className="h-8 bg-navy-950 text-white flex items-center px-3 justify-between z-10">
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
        </div>

        {/* System Status Icons */}
        <div className="flex items-center gap-3">
          <div className="text-white/80 text-xs flex flex-col items-end">
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] text-white/60">{formatDate()}</span>
          </div>
          
          {/* Quick Settings */}
          <QuickSettings />

          {/* User Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full p-0 h-6 w-6 overflow-hidden ml-1">
                <img 
                  src={user?.avatar} 
                  alt={user?.username} 
                  className="h-6 w-6 object-cover"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-56 p-0 border-navy-700 bg-navy-900 text-white" 
              align="end"
              side="bottom"
              sideOffset={5}
            >
              <div className="p-3 border-b border-navy-800">
                <div className="flex items-center gap-3">
                  <img 
                    src={user?.avatar} 
                    alt={user?.username} 
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{user?.username}</h3>
                    <p className="text-xs text-gray-400">Logged in</p>
                  </div>
                </div>
              </div>
              <div className="p-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-white hover:bg-navy-800"
                  onClick={() => handleOpenApp(apps.find(a => a.id === 'settings'))}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-white hover:bg-navy-800"
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
      <div className="flex-grow navy-gradient relative">
        {/* ChromeOS-style Shelf (dock at bottom) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-3 flex bg-navy-950/90 rounded-2xl p-1.5 border border-navy-800 backdrop-blur-md z-10">
          {apps.slice(0, 12).map((app) => {
            const isActive = activeApps.includes(app.id);
            
            return (
              <Tooltip key={app.id}>
                <TooltipTrigger asChild>
                  <button 
                    className={`app-icon-dock mx-1 transition-all hover:scale-105 relative ${
                      isActive ? 'after:content-[""] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-5px] after:w-1 after:h-1 after:bg-white after:rounded-full' : ''
                    }`}
                    onClick={() => handleOpenApp(app)}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-navy-700' : 'bg-navy-800/70'} border border-navy-700`}>
                      <img src={app.icon} alt={app.name} className="w-6 h-6" />
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-navy-900 text-white border-navy-700">
                  <p>{app.name}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* App Menu */}
        {isAppMenuOpen && (
          <div className="absolute top-0 left-0 z-50 w-80 bg-navy-900/95 text-white border border-navy-800 rounded-md mt-8 ml-2">
            <AppMenu apps={apps} onSelectApp={handleOpenApp} />
          </div>
        )}

        {/* Desktop Icons - Make sure they're properly clickable */}
        <div className="p-6 grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-4 z-0">
          {apps.map((app) => (
            <button 
              key={app.id} 
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => handleOpenApp(app)}
            >
              <div className="app-icon-img w-14 h-14 flex items-center justify-center bg-navy-800/50 rounded-xl mb-2 group-hover:bg-navy-700/70 transition-all border border-navy-700/50 backdrop-blur-sm">
                <img src={app.icon} alt={app.name} className="w-8 h-8" />
              </div>
              <span className="text-white text-xs font-medium bg-navy-950/80 px-2 py-0.5 rounded-md max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
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
