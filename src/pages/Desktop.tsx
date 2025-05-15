
import { useState, useEffect } from 'react';
import { useOrbitOS } from '../context/OrbitOSContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Settings, LogOut, X, Minus, LayoutGrid, Clock } from 'lucide-react';
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
    }
  ];

  const handleLogout = () => {
    toast.info('Logging out...');
    setTimeout(logout, 1000);
  };
  
  const handleOpenApp = (app: any) => {
    openWindow(app);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Desktop Area */}
      <div 
        className="flex-grow bg-orbit-bg bg-[url('https://images.unsplash.com/photo-1484950763426-56b5bf172dbb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative"
      >
        {/* Desktop Icons */}
        <div className="p-4 grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
          {apps.map((app) => (
            <div 
              key={app.id} 
              className="app-icon" 
              onClick={() => handleOpenApp(app)}
            >
              <div className="app-icon-img flex items-center justify-center bg-white/20 backdrop-blur-sm">
                <img src={app.icon} alt={app.name} className="w-8 h-8" />
              </div>
              <span className="text-white text-xs mt-1 text-center font-medium drop-shadow-md">
                {app.name}
              </span>
            </div>
          ))}
        </div>

        {/* Window Manager */}
        <WindowManager />
      </div>

      {/* Taskbar */}
      <div className="orbit-taskbar h-12 text-white">
        {/* Start Button / App Menu */}
        <Popover open={isAppMenuOpen} onOpenChange={setIsAppMenuOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-10 w-10 rounded-full bg-orbit-accent text-white hover:bg-orbit-accent/80"
            >
              <LayoutGrid size={20} />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-80 p-0 border-orbit-border bg-orbit-bg/95 backdrop-blur-md" 
            align="start" 
            side="top"
            sideOffset={10}
          >
            <AppMenu apps={apps} onSelectApp={(app) => {
              handleOpenApp(app);
              setIsAppMenuOpen(false);
            }} />
          </PopoverContent>
        </Popover>

        {/* Open Windows */}
        <div className="flex-1 ml-2 flex items-center gap-1 overflow-x-auto">
          {windows.map((window) => {
            const app = apps.find(a => a.id === window.app);
            if (!app) return null;
            
            return (
              <Tooltip key={window.id}>
                <TooltipTrigger asChild>
                  <Button 
                    variant={window.isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => window.isMinimized ? useOrbitOS().restoreWindow(window.id) : useOrbitOS().focusWindow(window.id)}
                  >
                    <img src={app.icon} alt={window.title} className="w-4 h-4 mr-1.5" />
                    {window.title}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {window.isMinimized ? "Restore" : "Switch to"} {window.title}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* System Tray */}
        <div className="flex items-center mr-2">
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 h-9 w-9 rounded-full">
                <Bell size={18} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orbit-accent rounded-full" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 p-0 border-orbit-border bg-orbit-bg/95 backdrop-blur-md" 
              align="end"
              side="top"
              sideOffset={10}
            >
              <div className="p-2 border-b border-orbit-border">
                <h3 className="font-medium text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-white/60">
                    No notifications
                  </div>
                ) : (
                  <>
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-3 border-b border-orbit-border hover:bg-white/5 cursor-pointer ${notification.read ? 'opacity-60' : ''}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-white">{notification.title}</h4>
                          <span className="text-xs text-white/60">
                            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-white/80 mt-1">{notification.message}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Clock */}
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 h-9 rounded-full">
            <Clock size={18} className="mr-1.5" />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Button>

          {/* User Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1 rounded-full p-0 h-8 w-8 overflow-hidden">
                <img 
                  src={user?.avatar} 
                  alt={user?.username} 
                  className="h-8 w-8 object-cover"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-56 p-0 border-orbit-border bg-orbit-bg/95 backdrop-blur-md" 
              align="end"
              side="top"
              sideOffset={10}
            >
              <div className="p-3 border-b border-orbit-border">
                <div className="flex items-center gap-3">
                  <img 
                    src={user?.avatar} 
                    alt={user?.username} 
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium text-white">{user?.username}</h3>
                    <p className="text-xs text-white/60">Logged in</p>
                  </div>
                </div>
              </div>
              <div className="p-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={() => handleOpenApp(apps.find(a => a.id === 'settings'))}
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-white hover:bg-white/10"
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
    </div>
  );
};

export default Desktop;
