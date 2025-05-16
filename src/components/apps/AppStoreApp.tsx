
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Grid2x2, Bookmark, ArrowLeft, ArrowRight, RefreshCcw, Home } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AppItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  url?: string;
  featured?: boolean;
}

const AppStoreApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('featured');
  const [customUrl, setCustomUrl] = useState('');
  const [webViewUrl, setWebViewUrl] = useState('https://example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(['https://example.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [featuredApps, setFeaturedApps] = useState<AppItem[]>([]);
  const [allApps, setAllApps] = useState<AppItem[]>([]);

  // Initial app data
  useEffect(() => {
    const apps: AppItem[] = [
      {
        id: 'spotify',
        name: 'Spotify',
        description: 'Music streaming service',
        icon: 'https://play-lh.googleusercontent.com/P2VMEenhpIsubG2oWbvuLGrs0GyyzLiDosGTg8bi8htRXg9Uf0eUtHiUjC28p1jgpko',
        category: 'music',
        url: 'https://open.spotify.com',
        featured: true
      },
      {
        id: 'youtube',
        name: 'YouTube',
        description: 'Video sharing platform',
        icon: 'https://play-lh.googleusercontent.com/lMoItBgdPPVDJsNOVtP26EKHePkwBg-PkuY9NOrc-fumRtTFP4XhpUNk_22syN4Datc',
        category: 'video',
        url: 'https://www.youtube.com',
        featured: true
      },
      {
        id: 'netflix',
        name: 'Netflix',
        description: 'Streaming service',
        icon: 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI',
        category: 'entertainment',
        url: 'https://www.netflix.com',
        featured: true
      },
      {
        id: 'twitter',
        name: 'Twitter',
        description: 'Social media platform',
        icon: 'https://about.x.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png',
        category: 'social',
        url: 'https://twitter.com'
      },
      {
        id: 'github',
        name: 'GitHub',
        description: 'Code hosting platform',
        icon: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
        category: 'developer',
        url: 'https://github.com'
      },
      {
        id: 'wikipedia',
        name: 'Wikipedia',
        description: 'Online encyclopedia',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Wikipedia%27s_W.svg/1200px-Wikipedia%27s_W.svg.png',
        category: 'reference',
        url: 'https://www.wikipedia.org'
      },
      {
        id: 'twitch',
        name: 'Twitch',
        description: 'Live streaming platform',
        icon: 'https://play-lh.googleusercontent.com/QLQzL-MXtxKEDlbhrQCDw-REiDsA9glUH4m16syfar_KVLRXlzOhN7tmAceiPerv4Jg',
        category: 'entertainment',
        url: 'https://www.twitch.tv'
      },
      {
        id: 'reddit',
        name: 'Reddit',
        description: 'Social news aggregation',
        icon: 'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png',
        category: 'social',
        url: 'https://www.reddit.com'
      },
      {
        id: 'discord',
        name: 'Discord',
        description: 'Communication platform',
        icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png',
        category: 'social',
        url: 'https://discord.com'
      }
    ];
    
    setAllApps(apps);
    setFeaturedApps(apps.filter(app => app.featured));
  }, []);

  // Filtered apps based on search query
  const filteredApps = searchQuery
    ? allApps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allApps;

  const loadUrl = async (urlToLoad: string) => {
    if (!urlToLoad.startsWith('http')) {
      urlToLoad = `https://${urlToLoad}`;
    }

    setIsLoading(true);
    try {
      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(urlToLoad)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      setContent(text);
      setWebViewUrl(urlToLoad);
      
      // Update URL history
      if (urlToLoad !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1).concat(urlToLoad);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    } catch (error) {
      console.error('Error loading URL:', error);
      toast.error(`Failed to load: ${urlToLoad}`);
      setContent(`<div class="p-4"><h1>Failed to load URL</h1><p>${error instanceof Error ? error.message : String(error)}</p></div>`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      loadUrl(history[newIndex]);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      loadUrl(history[newIndex]);
    }
  };

  const handleRefresh = () => {
    loadUrl(webViewUrl);
  };

  const handleOpenApp = (app: AppItem) => {
    if (app.url) {
      setActiveTab('webview');
      loadUrl(app.url);
    } else {
      toast.info(`${app.name} doesn't have a URL configured`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      loadUrl(customUrl);
    }
  };

  const handleInstallApp = (app: AppItem) => {
    toast.success(`${app.name} installed successfully!`);
  };

  return (
    <div className="flex flex-col h-full bg-navy-950">
      <div className="bg-navy-900 p-3 border-b border-navy-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">App Store</h1>
        <div className="relative w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-navy-400" />
          <Input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-navy-800 border-navy-700 text-white placeholder:text-navy-400 h-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 border-b border-navy-800">
          <TabsList className="bg-navy-900 mt-2">
            <TabsTrigger value="featured" className="data-[state=active]:bg-navy-800">
              Featured
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-navy-800">
              All Apps
            </TabsTrigger>
            <TabsTrigger value="installed" className="data-[state=active]:bg-navy-800">
              Installed
            </TabsTrigger>
            <TabsTrigger value="webview" className="data-[state=active]:bg-navy-800">
              Web View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="featured" className="flex-1 overflow-auto p-4 m-0">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Featured Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredApps.map((app) => (
                <div key={app.id} className="bg-navy-800 rounded-xl p-4 border border-navy-700 flex flex-col">
                  <div className="flex items-center mb-3">
                    <img src={app.icon} alt={app.name} className="w-12 h-12 rounded-xl mr-3" />
                    <div>
                      <h3 className="font-medium text-white">{app.name}</h3>
                      <p className="text-xs text-navy-300">{app.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-navy-200 mb-3">{app.description}</p>
                  <div className="mt-auto flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-navy-600 bg-navy-900 text-white"
                      onClick={() => handleOpenApp(app)}
                    >
                      Open
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleInstallApp(app)}
                    >
                      <Download size={14} className="mr-1" />
                      Install
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-3">New Arrivals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allApps.slice(0, 5).map((app) => (
                <div key={app.id} className="bg-navy-800 rounded-xl p-3 border border-navy-700 text-center">
                  <img src={app.icon} alt={app.name} className="w-16 h-16 rounded-xl mx-auto mb-2" />
                  <h3 className="font-medium text-white text-sm">{app.name}</h3>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-full mt-2 text-xs"
                    onClick={() => handleInstallApp(app)}
                  >
                    <Download size={12} className="mr-1" />
                    Install
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all" className="flex-1 overflow-auto p-4 m-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-navy-800 rounded-xl p-4 border border-navy-700 flex">
                <img src={app.icon} alt={app.name} className="w-16 h-16 rounded-xl mr-3" />
                <div className="flex-1">
                  <h3 className="font-medium text-white">{app.name}</h3>
                  <p className="text-xs text-navy-300 mb-1">{app.category}</p>
                  <p className="text-sm text-navy-200 mb-2 line-clamp-2">{app.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-navy-600 bg-navy-900 text-white"
                      onClick={() => handleOpenApp(app)}
                    >
                      Open
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs"
                      onClick={() => handleInstallApp(app)}
                    >
                      <Download size={14} className="mr-1" />
                      Install
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="installed" className="flex-1 overflow-auto p-4 m-0">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Installed Apps</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Grid2x2 size={16} />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Bookmark size={16} />
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] text-navy-300">
            <p>No apps installed yet</p>
            <Button 
              onClick={() => setActiveTab('all')} 
              className="mt-3"
            >
              Browse Apps
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="webview" className="flex-1 overflow-hidden m-0 flex flex-col">
          {/* URL Bar */}
          <div className="flex items-center gap-1 p-2 bg-navy-900 border-b border-navy-700">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleGoBack}
              disabled={historyIndex <= 0}
            >
              <ArrowLeft size={16} className="text-white" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleGoForward}
              disabled={historyIndex >= history.length - 1}
            >
              <ArrowRight size={16} className="text-white" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleRefresh}
            >
              <RefreshCcw size={16} className={isLoading ? 'animate-spin text-white' : 'text-white'} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => loadUrl('https://example.com')}
            >
              <Home size={16} className="text-white" />
            </Button>
            
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search size={14} className="text-navy-400" />
              </div>
              <Input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-8 h-8 bg-navy-800 border-navy-700 text-white"
                placeholder="Enter URL or search"
              />
            </div>
            <Button 
              onClick={() => loadUrl(customUrl)} 
              size="sm" 
              className="h-8"
            >
              Go
            </Button>
          </div>

          {/* Web Content */}
          <div className="flex-1 bg-white overflow-auto">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-navy-900">
                  <h2 className="text-xl font-medium mb-2">Enter a URL to get started</h2>
                  <p className="text-navy-600">
                    Use the address bar above to navigate to a website
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppStoreApp;
