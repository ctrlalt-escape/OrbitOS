
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, RefreshCcw, Home, Search, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

const BrowserApp = () => {
  const [url, setUrl] = useState('https://example.com');
  const [isLoading, setIsLoading] = useState(false);
  const [tabs, setTabs] = useState([
    { id: 'tab-1', title: 'Example', url: 'https://example.com', isActive: true }
  ]);
  const [history, setHistory] = useState<string[]>(['https://example.com']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [content, setContent] = useState<string | null>(null);

  // Find the active tab
  const activeTab = tabs.find(tab => tab.isActive);

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
      
      // Update title based on content
      const titleMatch = text.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : urlToLoad;
      
      // Update the active tab
      if (activeTab) {
        setTabs(tabs.map(tab => 
          tab.id === activeTab.id 
            ? { ...tab, title, url: urlToLoad } 
            : tab
        ));
      }
      
      // Update URL and history
      setUrl(urlToLoad);
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
    if (activeTab) {
      loadUrl(activeTab.url);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      loadUrl(url);
    }
  };

  const addNewTab = () => {
    // Deactivate all tabs
    const updatedTabs = tabs.map(tab => ({
      ...tab,
      isActive: false
    }));
    
    // Create a new active tab
    const newTab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      url: 'about:blank',
      isActive: true
    };
    
    setTabs([...updatedTabs, newTab]);
    setUrl('about:blank');
    setContent('<div class="p-4"><h1>New Tab</h1><p>Enter a URL to browse</p></div>');
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Don't allow closing the last tab
    if (tabs.length <= 1) {
      toast.info("Can't close the last tab");
      return;
    }
    
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const isActiveTab = tabs[tabIndex].isActive;
    
    // Remove the tab
    const newTabs = tabs.filter(t => t.id !== tabId);
    
    // If we closed the active tab, activate another one
    if (isActiveTab) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[newActiveIndex].isActive = true;
      
      // Update URL and content to match the newly active tab
      setUrl(newTabs[newActiveIndex].url);
      loadUrl(newTabs[newActiveIndex].url);
    }
    
    setTabs(newTabs);
  };

  const switchTab = (tabId: string) => {
    const newTabs = tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    }));
    
    setTabs(newTabs);
    
    const activeTab = newTabs.find(tab => tab.isActive);
    if (activeTab) {
      setUrl(activeTab.url);
      loadUrl(activeTab.url);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex bg-gray-100 border-b">
        <div className="flex flex-1 overflow-x-auto">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`flex items-center px-3 py-2 border-r border-gray-200 min-w-[120px] max-w-[200px] cursor-pointer ${
                tab.isActive ? 'bg-white' : 'hover:bg-gray-200'
              }`}
              onClick={() => switchTab(tab.id)}
            >
              <div className="flex-1 truncate text-sm">{tab.title}</div>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 ml-1 p-0"
                onClick={(e) => closeTab(tab.id, e)}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 m-1"
          onClick={addNewTab}
        >
          <Plus size={16} />
        </Button>
      </div>
      
      {/* URL Bar */}
      <div className="flex items-center gap-1 p-2 bg-white border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleGoBack}
          disabled={historyIndex <= 0}
        >
          <ArrowLeft size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleGoForward}
          disabled={historyIndex >= history.length - 1}
        >
          <ArrowRight size={16} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleRefresh}
        >
          <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => loadUrl('https://example.com')}
        >
          <Home size={16} />
        </Button>
        
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <Search size={14} className="text-gray-400" />
          </div>
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-8 h-8"
            placeholder="Enter URL or search"
          />
        </div>
      </div>
      
      {/* Browser Content */}
      <div className="flex-1 bg-white overflow-auto">
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-medium mb-2">Enter a URL to get started</h2>
              <p className="text-gray-500">
                Use the address bar above to navigate to a website
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserApp;
