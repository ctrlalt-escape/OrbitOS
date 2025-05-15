
import { useState } from 'react';
import { useOrbitOS } from '@/context/OrbitOSContext';
import { Input } from '@/components/ui/input';
import { Search, User, LogOut, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface App {
  id: string;
  name: string;
  icon: string;
}

interface AppMenuProps {
  apps: App[];
  onSelectApp: (app: App) => void;
}

const AppMenu = ({ apps, onSelectApp }: AppMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useOrbitOS();

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    toast.info('Logging out...');
    setTimeout(logout, 1000);
  };

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* User Info */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <img 
          src={user?.avatar} 
          alt={user?.username} 
          className="h-12 w-12 rounded-full border border-white/20"
        />
        <div>
          <h3 className="text-white font-medium">{user?.username}</h3>
          <div className="flex items-center gap-2 mt-1">
            <button className="text-xs bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-colors">
              Account
            </button>
            <button 
              onClick={handleLogout}
              className="text-xs bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search applications..."
            className="pl-9 bg-white/10 border-white/10 text-white placeholder:text-white/60 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Apps Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredApps.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            No applications found
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-all"
                onClick={() => onSelectApp(app)}
              >
                <div className="w-16 h-16 bg-gradient-to-b from-white/20 to-white/5 rounded-xl flex items-center justify-center mb-2 shadow-lg border border-white/10">
                  <img src={app.icon} alt={app.name} className="w-10 h-10" />
                </div>
                <span className="text-white text-xs text-center">{app.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Settings */}
      <div className="border-t border-gray-700 p-3">
        <h3 className="text-xs text-white/40 uppercase mb-2 px-2">System</h3>
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-b from-blue-500/80 to-blue-600/80 rounded-lg flex items-center justify-center mb-1">
              <Settings size={20} className="text-white" />
            </div>
            <span className="text-white text-xs">Settings</span>
          </button>
          <button className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-b from-green-500/80 to-green-600/80 rounded-lg flex items-center justify-center mb-1">
              <User size={20} className="text-white" />
            </div>
            <span className="text-white text-xs">Account</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-b from-red-500/80 to-red-600/80 rounded-lg flex items-center justify-center mb-1">
              <LogOut size={20} className="text-white" />
            </div>
            <span className="text-white text-xs">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppMenu;
