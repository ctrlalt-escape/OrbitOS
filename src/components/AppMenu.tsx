
import { useState } from 'react';
import { useOrbitOS } from '@/context/OrbitOSContext';
import { Input } from '@/components/ui/input';
import { Search, User, LogOut } from 'lucide-react';
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
    <div className="flex flex-col h-full max-h-[500px]">
      {/* User Info */}
      <div className="p-4 border-b border-orbit-border">
        <div className="flex items-center gap-3">
          <img 
            src={user?.avatar} 
            alt={user?.username} 
            className="h-12 w-12 rounded-full"
          />
          <div>
            <h3 className="font-medium text-white">{user?.username}</h3>
            <p className="text-xs text-white/60">Logged in as user</p>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="p-3 border-b border-orbit-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search applications..."
            className="pl-9 bg-white/10 border-white/10 text-white placeholder:text-white/60"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Apps Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredApps.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            No applications found
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-white/10 transition-colors"
                onClick={() => onSelectApp(app)}
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                  <img src={app.icon} alt={app.name} className="w-8 h-8" />
                </div>
                <span className="text-white text-xs text-center">{app.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Quick Actions */}
      <div className="border-t border-orbit-border p-2">
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors text-white text-sm w-full">
            <User size={16} />
            My Account
          </button>
          <button 
            className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10 transition-colors text-white text-sm w-full"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppMenu;
