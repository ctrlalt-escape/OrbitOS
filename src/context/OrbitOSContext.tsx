
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  avatar: string;
  createdAt: Date;
}

export interface Window {
  id: string;
  title: string;
  app: string;
  isActive: boolean;
  isMinimized: boolean;
  zIndex: number;
  width: number;
  height: number;
  x: number;
  y: number;
  component: ReactNode;
}

export interface App {
  id: string;
  name: string;
  icon: string;
  component: ReactNode;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  icon?: string;
  timestamp: Date;
  read: boolean;
}

interface OrbitOSContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string) => Promise<boolean>;
  windows: Window[];
  openWindow: (app: App) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  apps: App[];
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  installedApps: string[];
  userAccounts: UserAccount[];
}

const OrbitOSContext = createContext<OrbitOSContextType | undefined>(undefined);

// Mock user data
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'password',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    createdAt: new Date()
  },
  {
    id: '2',
    username: 'guest',
    password: 'guest',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
    createdAt: new Date()
  }
];

// Local storage keys
const LOCAL_STORAGE_KEYS = {
  USER: 'orbitOS-user',
  USER_ACCOUNTS: 'orbitOS-users'
};

export const OrbitOSProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [windows, setWindows] = useState<Window[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const [apps, setApps] = useState<App[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [installedApps, setInstalledApps] = useState<string[]>([
    'notes', 'browser', 'files', 'settings', 'calendar', 'terminal', 'calculator', 'photos', 'mail'
  ]);

  // Load user accounts from local storage
  useEffect(() => {
    const savedAccounts = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ACCOUNTS);
    if (savedAccounts) {
      try {
        const parsedAccounts = JSON.parse(savedAccounts);
        setUserAccounts(parsedAccounts);
      } catch (error) {
        console.error('Failed to parse user accounts', error);
        // Initialize with mock users if parsing fails
        setUserAccounts(mockUsers);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(mockUsers));
      }
    } else {
      // Initialize with mock users if no accounts exist
      setUserAccounts(mockUsers);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(mockUsers));
    }
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      }
    }
  }, []);

  // Register new user
  const register = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if username already exists
    const existingUser = userAccounts.find(u => u.username === username);
    if (existingUser) {
      return false;
    }
    
    // Create new user account
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      createdAt: new Date()
    };
    
    const updatedAccounts = [...userAccounts, newUser];
    setUserAccounts(updatedAccounts);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_ACCOUNTS, JSON.stringify(updatedAccounts));
    
    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
    
    addNotification({
      title: 'Account Created',
      message: `Welcome to OrbitOS, ${username}!`,
      icon: 'bell'
    });
    
    return true;
  };

  // Login logic
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = userAccounts.find(
      u => u.username === username && u.password === password
    );
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      // Save to local storage
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userWithoutPassword));
      
      // Add welcome notification
      addNotification({
        title: 'Welcome back',
        message: `Welcome back, ${username}!`,
        icon: 'bell'
      });
      
      return true;
    }
    
    return false;
  };

  // Logout logic
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setWindows([]);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  };

  // Window management
  const openWindow = (app: App) => {
    // Check if window for this app is already open
    const existingWindow = windows.find(w => w.app === app.id);
    
    if (existingWindow) {
      // If window is minimized, restore it
      if (existingWindow.isMinimized) {
        restoreWindow(existingWindow.id);
      }
      // Focus the window
      focusWindow(existingWindow.id);
      return;
    }
    
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    const newWindow: Window = {
      id: `window-${Date.now()}`,
      title: app.name,
      app: app.id,
      isActive: true,
      isMinimized: false,
      zIndex: newZIndex,
      width: 800,
      height: 500,
      x: 100 + (windows.length * 20) % 200,
      y: 100 + (windows.length * 20) % 200,
      component: app.component,
    };
    
    // Deactivate all other windows
    const updatedWindows = windows.map(w => ({
      ...w,
      isActive: false
    }));
    
    setWindows([...updatedWindows, newWindow]);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: true, isActive: false } : w
    ));
  };

  const restoreWindow = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    setWindows(windows.map(w => 
      w.id === id 
        ? { ...w, isMinimized: false, isActive: true, zIndex: newZIndex } 
        : { ...w, isActive: false }
    ));
  };

  const focusWindow = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    setWindows(windows.map(w => 
      w.id === id 
        ? { ...w, isActive: true, zIndex: newZIndex } 
        : { ...w, isActive: false }
    ));
  };

  // Notification management
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast
    toast.info(notification.title, {
      description: notification.message,
      duration: 5000,
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
    apps,
    notifications,
    addNotification,
    markNotificationAsRead,
    installedApps,
    userAccounts
  };

  return (
    <OrbitOSContext.Provider value={value}>
      {children}
    </OrbitOSContext.Provider>
  );
};

export const useOrbitOS = (): OrbitOSContextType => {
  const context = useContext(OrbitOSContext);
  if (context === undefined) {
    throw new Error('useOrbitOS must be used within an OrbitOSProvider');
  }
  return context;
};
