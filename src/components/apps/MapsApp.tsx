
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MapPin, Compass, Navigation, Map } from 'lucide-react';
import { toast } from 'sonner';

const MapsApp = () => {
  const [location, setLocation] = useState<string>('');
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  const [savedLocations, setSavedLocations] = useState<string[]>([
    'New York, NY', 'London, UK', 'Tokyo, Japan', 'Sydney, Australia'
  ]);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [currentCoordinates, setCurrentCoordinates] = useState<{lat: number, lng: number}>({ lat: 37.7749, lng: -122.4194 }); // San Francisco by default

  const handleSearch = () => {
    if (!location.trim()) return;
    
    // In a real app, this would call a geocoding API
    toast.info(`Searching for: ${location}`);
    
    // Simulate searching for a location
    setTimeout(() => {
      // Random coordinates for demonstration
      const newLat = 34 + Math.random() * 10;
      const newLng = -118 - Math.random() * 10;
      setCurrentCoordinates({ lat: newLat, lng: newLng });
      toast.success(`Found ${location}`);
      
      // Add to saved locations if not already there
      if (!savedLocations.includes(location)) {
        setSavedLocations([...savedLocations, location]);
      }
      
      setLocation('');
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSavedLocationClick = (loc: string) => {
    toast.info(`Loading ${loc}...`);
    
    // Simulate loading a saved location
    setTimeout(() => {
      // Random coordinates for demonstration
      const newLat = 34 + Math.random() * 10;
      const newLng = -118 - Math.random() * 10;
      setCurrentCoordinates({ lat: newLat, lng: newLng });
      toast.success(`Loaded ${loc}`);
    }, 800);
  };

  const handleZoomIn = () => {
    if (mapZoom < 10) {
      setMapZoom(mapZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapZoom > 1) {
      setMapZoom(mapZoom - 1);
    }
  };

  const handleMyLocation = () => {
    toast.info('Getting your current location...');
    
    // In a real app, this would use the browser's geolocation API
    setTimeout(() => {
      setCurrentCoordinates({ lat: 37.7749, lng: -122.4194 }); // San Francisco coordinates
      toast.success('Found your location');
    }, 1000);
  };

  // Generate a pseudo-map grid for visualization
  const generateMapGrid = () => {
    const size = mapZoom * 5;
    const grid = [];
    
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        // Determine if this cell should contain the location pin
        const isCenter = i === Math.floor(size/2) && j === Math.floor(size/2);
        row.push(
          <div 
            key={`${i}-${j}`} 
            className={`h-6 w-6 border border-navy-700 ${
              mapMode === 'standard' ? 'bg-navy-800' : 'bg-navy-900'
            } ${isCenter ? 'relative' : ''}`}
          >
            {isCenter && (
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="text-red-500 h-5 w-5" />
              </div>
            )}
          </div>
        );
      }
      grid.push(
        <div key={`row-${i}`} className="flex">
          {row}
        </div>
      );
    }
    
    return grid;
  };

  return (
    <div className="flex flex-col h-full bg-navy-950 text-white">
      {/* Header with search */}
      <div className="p-3 border-b border-navy-800 flex">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
          <Input
            placeholder="Search locations..."
            className="pl-9 bg-navy-800 border-navy-700 text-white placeholder:text-white/60 focus:ring-navy-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-2 bg-navy-800"
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-2 bg-navy-800"
          onClick={handleMyLocation}
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-navy-800 flex flex-col">
          <Tabs defaultValue="saved" className="flex-1 flex flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
              <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
            </TabsList>
            
            <TabsContent value="saved" className="p-0 m-0 flex-1 overflow-hidden">
              <div className="p-3">
                {savedLocations.map((loc, index) => (
                  <div 
                    key={index}
                    className="p-2 hover:bg-navy-800 rounded cursor-pointer"
                    onClick={() => handleSavedLocationClick(loc)}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-navy-400" />
                      <span>{loc}</span>
                    </div>
                  </div>
                ))}
                
                {savedLocations.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No saved locations</p>
                    <p className="text-sm mt-1">Search for a location to save it</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="p-0 m-0 flex-1 overflow-hidden">
              <div className="p-3">
                <div className="text-center py-8 text-gray-400">
                  <p>No recent locations</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="p-3 border-t border-navy-800">
            <Button 
              variant="outline"
              size="sm"
              className="w-full bg-navy-800 border-navy-700"
              onClick={() => toast.info('Directions feature coming soon')}
            >
              <Navigation className="mr-2 h-4 w-4" />
              Get Directions
            </Button>
          </div>
        </div>
        
        {/* Map area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden relative">
            {/* Pseudo map visualization */}
            <div className="absolute inset-0 flex items-center justify-center overflow-auto">
              <div>{generateMapGrid()}</div>
            </div>
            
            {/* Map controls */}
            <div className="absolute right-4 top-4 flex flex-col bg-navy-900 border border-navy-800 rounded-md overflow-hidden">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-none border-b border-navy-800"
                onClick={handleZoomIn}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 1V14M1 7.5H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-none"
                onClick={handleZoomOut}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7.5H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Button>
            </div>
            
            <div className="absolute left-4 bottom-4">
              <div className="bg-navy-900 border border-navy-800 rounded-md overflow-hidden">
                <Button 
                  variant={mapMode === 'standard' ? 'default' : 'ghost'}
                  size="sm"
                  className={mapMode === 'standard' ? 'bg-navy-700' : ''}
                  onClick={() => setMapMode('standard')}
                >
                  Standard
                </Button>
                <Button 
                  variant={mapMode === 'satellite' ? 'default' : 'ghost'}
                  size="sm"
                  className={mapMode === 'satellite' ? 'bg-navy-700' : ''}
                  onClick={() => setMapMode('satellite')}
                >
                  Satellite
                </Button>
              </div>
            </div>
            
            <div className="absolute left-4 top-4">
              <div className="bg-navy-900 border border-navy-800 rounded-md p-2 text-sm">
                {currentCoordinates.lat.toFixed(4)}, {currentCoordinates.lng.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapsApp;
