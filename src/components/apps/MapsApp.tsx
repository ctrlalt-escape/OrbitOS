
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, MapPin, Navigation, Layers, Compass, Star, Clock, Home, Briefcase, Plus, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface MapLocation {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [latitude, longitude]
  rating?: number;
  distance?: string;
  category?: string;
  isFavorite?: boolean;
}

const MapsApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<[number, number]>([37.7749, -122.4194]); // San Francisco
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [viewMode, setViewMode] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [favorites, setFavorites] = useState<MapLocation[]>([
    {
      id: 'fav1',
      name: 'Home',
      address: '123 Main Street, San Francisco, CA',
      coordinates: [37.7749, -122.4194],
      isFavorite: true
    },
    {
      id: 'fav2',
      name: 'Work',
      address: '456 Market Street, San Francisco, CA',
      coordinates: [37.7899, -122.4009],
      isFavorite: true
    }
  ]);
  
  const [recentSearches, setRecentSearches] = useState<MapLocation[]>([
    {
      id: 'recent1',
      name: 'Golden Gate Park',
      address: 'San Francisco, CA',
      coordinates: [37.7694, -122.4862],
    },
    {
      id: 'recent2',
      name: 'Fisherman\'s Wharf',
      address: 'San Francisco, CA',
      coordinates: [37.8080, -122.4177],
    }
  ]);
  
  const [nearbyPlaces, setNearbyPlaces] = useState<MapLocation[]>([
    {
      id: 'near1',
      name: 'Blue Bottle Coffee',
      address: '315 Linden St, San Francisco, CA',
      coordinates: [37.7749, -122.4244],
      rating: 4.5,
      distance: '0.2 mi',
      category: 'Coffee Shop'
    },
    {
      id: 'near2',
      name: 'Golden Gate Bakery',
      address: '1029 Grant Ave, San Francisco, CA',
      coordinates: [37.7969, -122.4077],
      rating: 4.8,
      distance: '0.4 mi',
      category: 'Bakery'
    },
    {
      id: 'near3',
      name: 'Tadich Grill',
      address: '240 California St, San Francisco, CA',
      coordinates: [37.7935, -122.3997],
      rating: 4.6,
      distance: '0.7 mi',
      category: 'Restaurant'
    },
    {
      id: 'near4',
      name: 'City Lights Bookstore',
      address: '261 Columbus Ave, San Francisco, CA',
      coordinates: [37.7976, -122.4065],
      rating: 4.7,
      distance: '0.9 mi',
      category: 'Bookstore'
    },
    {
      id: 'near5',
      name: 'The Ferry Building',
      address: '1 Ferry Building, San Francisco, CA',
      coordinates: [37.7955, -122.3937],
      rating: 4.7,
      distance: '1.1 mi',
      category: 'Shopping Center'
    }
  ]);
  
  const [isSearching, setIsSearching] = useState(false);
  const [isDirectionsMode, setIsDirectionsMode] = useState(false);
  const [startLocation, setStartLocation] = useState('Current Location');
  const [endLocation, setEndLocation] = useState('');
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    toast.success(`Searching for: ${searchQuery}`);
    
    // Simulate search result
    const newLocation: MapLocation = {
      id: `search-${Date.now()}`,
      name: searchQuery,
      address: `${searchQuery}, San Francisco, CA`,
      coordinates: [
        currentLocation[0] + (Math.random() * 0.02 - 0.01),
        currentLocation[1] + (Math.random() * 0.02 - 0.01)
      ]
    };
    
    setSelectedLocation(newLocation);
    
    // Add to recent searches
    setRecentSearches(prev => [newLocation, ...prev.slice(0, 4)]);
    
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleSelectLocation = (location: MapLocation) => {
    setSelectedLocation(location);
    
    // Center map on selected location
    setCurrentLocation(location.coordinates);
    
    if (isDirectionsMode) {
      setEndLocation(location.name);
    }
  };

  const handleToggleFavorite = (location: MapLocation) => {
    if (location.isFavorite) {
      // Remove from favorites
      setFavorites(prev => prev.filter(fav => fav.id !== location.id));
      setSelectedLocation(prev => 
        prev?.id === location.id 
          ? { ...prev, isFavorite: false }
          : prev
      );
    } else {
      // Add to favorites
      const favoriteLocation = { ...location, isFavorite: true };
      setFavorites(prev => [...prev, favoriteLocation]);
      setSelectedLocation(prev => 
        prev?.id === location.id 
          ? { ...prev, isFavorite: true }
          : prev
      );
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const handleGetDirections = () => {
    if (!selectedLocation) return;
    
    setIsDirectionsMode(true);
    setEndLocation(selectedLocation.name);
  };

  const handleStartDirections = () => {
    if (!endLocation) {
      toast.error('Please select a destination');
      return;
    }
    
    toast.success(`Showing directions to: ${endLocation}`, {
      description: 'Estimated travel time: 15 minutes'
    });
  };

  const handleCancelDirections = () => {
    setIsDirectionsMode(false);
    setEndLocation('');
  };

  const handleChangeMapType = (type: 'standard' | 'satellite' | 'terrain') => {
    setViewMode(type);
    toast.info(`Map view changed to ${type}`);
  };

  // Generate map grid for visualization
  const generateMapGrid = () => {
    const rows = 15;
    const cols = 20;
    const grid = [];
    
    const colors = {
      standard: { land: 'bg-navy-800', water: 'bg-blue-800' },
      satellite: { land: 'bg-green-900', water: 'bg-blue-900' },
      terrain: { land: 'bg-green-800', water: 'bg-blue-800' }
    };
    
    const currentColors = colors[viewMode];
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        // Create some variation for a map-like appearance
        const isWater = Math.random() > 0.75;
        row.push(isWater ? currentColors.water : currentColors.land);
      }
      grid.push(row);
    }
    
    return grid;
  };

  const mapGrid = generateMapGrid();

  return (
    <div className="h-full flex bg-navy-950 text-white">
      {/* Left sidebar */}
      {!isDirectionsMode && (
        <div className="w-80 border-r border-navy-800 flex flex-col">
          {/* Search */}
          <div className="p-3 border-b border-navy-800">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search places, addresses..."
                className="pl-9 bg-navy-800 border-navy-700 text-white placeholder:text-white/60 focus:ring-navy-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearching(true)}
                onBlur={() => setTimeout(() => setIsSearching(false), 100)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            {isSearching && (
              <div className="absolute z-10 mt-1 w-[calc(100%-24px)] bg-navy-900 border border-navy-800 rounded-md overflow-hidden shadow-lg">
                <div className="p-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Recent Searches</span>
                    <button className="text-xs text-blue-400 hover:underline">Clear All</button>
                  </div>
                  
                  {recentSearches.slice(0, 3).map(place => (
                    <div 
                      key={place.id}
                      className="flex items-center p-2 hover:bg-navy-800 rounded cursor-pointer"
                      onClick={() => handleSelectLocation(place)}
                    >
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm">{place.name}</div>
                        <div className="text-xs text-gray-400">{place.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="explore" className="flex-1 flex flex-col">
            <TabsList className="w-full border-b border-navy-800 py-1 rounded-none bg-transparent justify-start gap-2 px-2">
              <TabsTrigger value="explore" className="data-[state=active]:bg-navy-800">Explore</TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-navy-800">Saved</TabsTrigger>
            </TabsList>
            
            <TabsContent value="explore" className="p-0 m-0 flex-1 overflow-hidden">
              <ScrollArea className="flex-1 h-full">
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-2">Nearby Places</h3>
                  <div className="space-y-2">
                    {nearbyPlaces.map(place => (
                      <div 
                        key={place.id}
                        className="p-2 hover:bg-navy-800 rounded cursor-pointer"
                        onClick={() => handleSelectLocation(place)}
                      >
                        <div className="flex justify-between">
                          <div className="font-medium">{place.name}</div>
                          <div className="text-sm text-gray-400">{place.distance}</div>
                        </div>
                        <div className="text-sm text-gray-400">{place.category}</div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs text-yellow-400">
                            {'★'.repeat(Math.floor(place.rating || 0))}
                            {'☆'.repeat(5 - Math.floor(place.rating || 0))}
                            <span className="text-gray-400 ml-1">{place.rating}</span>
                          </div>
                          <button 
                            className="text-gray-400 hover:text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(place);
                            }}
                          >
                            <Star 
                              size={16} 
                              className={place.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} 
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-navy-800">
                    <h3 className="text-sm font-medium mb-2">Popular Categories</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['Restaurants', 'Coffee', 'Hotels', 'Shopping', 'Gas', 'Groceries'].map(category => (
                        <div 
                          key={category} 
                          className="bg-navy-800 p-2 rounded text-center cursor-pointer hover:bg-navy-700 text-sm"
                          onClick={() => {
                            setSearchQuery(category);
                            handleSearch();
                          }}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="saved" className="p-0 m-0 flex-1 overflow-hidden">
              <ScrollArea className="flex-1 h-full">
                <div className="p-3">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium">Favorite Places</h3>
                    <Button variant="ghost" size="sm" className="h-8 p-0 text-blue-400">
                      <Plus size={16} className="mr-1" />
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {favorites.length === 0 ? (
                      <div className="text-center py-4 text-gray-400">
                        No favorite places
                      </div>
                    ) : (
                      favorites.map(place => (
                        <div 
                          key={place.id}
                          className="p-2 hover:bg-navy-800 rounded cursor-pointer"
                          onClick={() => handleSelectLocation(place)}
                        >
                          <div className="flex items-center">
                            {place.name === 'Home' ? (
                              <Home size={16} className="text-blue-400 mr-2" />
                            ) : place.name === 'Work' ? (
                              <Briefcase size={16} className="text-blue-400 mr-2" />
                            ) : (
                              <Star size={16} className="text-yellow-400 fill-yellow-400 mr-2" />
                            )}
                            <div>
                              <div className="font-medium">{place.name}</div>
                              <div className="text-xs text-gray-400">{place.address}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-navy-800">
                    <h3 className="text-sm font-medium mb-2">Recent Searches</h3>
                    <div className="space-y-2">
                      {recentSearches.length === 0 ? (
                        <div className="text-center py-4 text-gray-400">
                          No recent searches
                        </div>
                      ) : (
                        recentSearches.map(place => (
                          <div 
                            key={place.id}
                            className="p-2 hover:bg-navy-800 rounded cursor-pointer"
                            onClick={() => handleSelectLocation(place)}
                          >
                            <div className="flex items-center">
                              <Clock size={16} className="text-gray-400 mr-2" />
                              <div>
                                <div className="font-medium">{place.name}</div>
                                <div className="text-xs text-gray-400">{place.address}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      )}
      
      {/* Directions sidebar */}
      {isDirectionsMode && (
        <div className="w-80 border-r border-navy-800 flex flex-col">
          <div className="p-3 border-b border-navy-800 flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 mr-2 text-white hover:bg-navy-800"
              onClick={handleCancelDirections}
            >
              <ChevronRight size={18} className="transform rotate-180" />
            </Button>
            <h2 className="font-medium">Directions</h2>
          </div>
          
          <div className="p-3 space-y-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Starting point</label>
              <Input
                placeholder="Choose starting point"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="bg-navy-800 border-navy-700 text-white"
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Destination</label>
              <Input
                placeholder="Choose destination"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                className="bg-navy-800 border-navy-700 text-white"
              />
            </div>
            
            <Button 
              className="w-full mt-2"
              onClick={handleStartDirections}
            >
              Get Directions
            </Button>
          </div>
          
          <div className="p-3 border-t border-navy-800 mt-2">
            <h3 className="text-sm font-medium mb-2">Route Options</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">Car</Button>
              <Button variant="outline" size="sm" className="flex-1">Transit</Button>
              <Button variant="outline" size="sm" className="flex-1">Walking</Button>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm mb-2">Suggested Routes</h4>
              <div className="space-y-2">
                <div className="p-2 bg-navy-800 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Fastest Route</span>
                    <span className="text-sm">15 min</span>
                  </div>
                  <div className="text-xs text-gray-400">Via Market St, 3.2 miles</div>
                </div>
                <div className="p-2 bg-navy-800 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Less Traffic</span>
                    <span className="text-sm">18 min</span>
                  </div>
                  <div className="text-xs text-gray-400">Via Mission St, 3.5 miles</div>
                </div>
                <div className="p-2 bg-navy-800 rounded">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Shortest Distance</span>
                    <span className="text-sm">20 min</span>
                  </div>
                  <div className="text-xs text-gray-400">Via Montgomery St, 3.0 miles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Map area */}
      <div className="flex-1 relative">
        {/* Simple map visualization */}
        <div className="h-full w-full grid grid-rows-15">
          {mapGrid.map((row, i) => (
            <div key={i} className="grid grid-cols-20 gap-px w-full">
              {row.map((cell, j) => (
                <div key={`${i}-${j}`} className={`${cell} ${i === 7 && j === 10 ? 'relative' : ''}`}>
                  {i === 7 && j === 10 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full relative"></div>
                    </div>
                  )}
                  {selectedLocation && i === 5 && j === 12 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin size={16} className="text-red-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Map controls */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-navy-900 hover:bg-navy-800 border-navy-700"
            onClick={handleZoomIn}
          >
            <Plus size={16} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-navy-900 hover:bg-navy-800 border-navy-700"
            onClick={handleZoomOut}
          >
            <div className="w-4 h-0.5 bg-current" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-navy-900 hover:bg-navy-800 border-navy-700"
            onClick={() => handleChangeMapType('standard')}
          >
            <Layers size={16} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 bg-navy-900 hover:bg-navy-800 border-navy-700"
            onClick={() => setCurrentLocation([37.7749, -122.4194])}
          >
            <Compass size={16} />
          </Button>
        </div>
        
        {/* Location details card */}
        {selectedLocation && !isDirectionsMode && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-navy-900 border border-navy-800 rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{selectedLocation.name}</h3>
                  <p className="text-sm text-gray-400">{selectedLocation.address}</p>
                  
                  {selectedLocation.rating && (
                    <div className="flex items-center mt-1">
                      <div className="text-xs text-yellow-400">
                        {'★'.repeat(Math.floor(selectedLocation.rating))}
                        {'☆'.repeat(5 - Math.floor(selectedLocation.rating))}
                      </div>
                      <span className="text-xs text-gray-400 ml-1">{selectedLocation.rating}</span>
                      {selectedLocation.distance && (
                        <span className="text-xs text-gray-400 ml-2">· {selectedLocation.distance}</span>
                      )}
                      {selectedLocation.category && (
                        <span className="text-xs text-gray-400 ml-2">· {selectedLocation.category}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white hover:bg-navy-800"
                  onClick={() => handleToggleFavorite(selectedLocation)}
                >
                  <Star 
                    size={18} 
                    className={selectedLocation.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''} 
                  />
                </Button>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button 
                  className="flex-1"
                  onClick={handleGetDirections}
                >
                  <Navigation size={16} className="mr-2" />
                  Directions
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone size={16} className="mr-2" />
                  Call
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share size={16} className="mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Missing icon definition
const Share = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

export default MapsApp;
