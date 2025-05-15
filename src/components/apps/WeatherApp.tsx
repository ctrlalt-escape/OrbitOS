
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Cloud, CloudRain, CloudSnow, CloudLightning, Sun, Droplets, Wind, Thermometer, MapPin, Globe, CloudSun, CloudMoon } from 'lucide-react';
import { toast } from 'sonner';

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  precipitation: number;
}

interface ForecastDay {
  day: string;
  condition: string;
  high: number;
  low: number;
  precipitation: number;
}

interface SavedLocation {
  id: string;
  name: string;
  country: string;
  temperature: number;
  condition: string;
}

const WeatherApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData>({
    location: 'San Francisco',
    country: 'United States',
    temperature: 72,
    condition: 'Sunny',
    high: 76,
    low: 65,
    feelsLike: 74,
    humidity: 62,
    windSpeed: 8,
    sunrise: '6:15 AM',
    sunset: '8:30 PM',
    precipitation: 0
  });
  
  const [forecast, setForecast] = useState<ForecastDay[]>([
    { day: 'Mon', condition: 'Sunny', high: 76, low: 65, precipitation: 0 },
    { day: 'Tue', condition: 'Partly Cloudy', high: 78, low: 66, precipitation: 10 },
    { day: 'Wed', condition: 'Cloudy', high: 74, low: 64, precipitation: 20 },
    { day: 'Thu', condition: 'Rain', high: 70, low: 62, precipitation: 80 },
    { day: 'Fri', condition: 'Sunny', high: 75, low: 63, precipitation: 0 },
    { day: 'Sat', condition: 'Sunny', high: 77, low: 65, precipitation: 0 },
    { day: 'Sun', condition: 'Partly Cloudy', high: 76, low: 66, precipitation: 10 }
  ]);
  
  const [hourlyForecast, setHourlyForecast] = useState([
    { time: 'Now', temperature: 72, condition: 'Sunny', precipitation: 0 },
    { time: '1 PM', temperature: 73, condition: 'Sunny', precipitation: 0 },
    { time: '2 PM', temperature: 74, condition: 'Sunny', precipitation: 0 },
    { time: '3 PM', temperature: 75, condition: 'Sunny', precipitation: 0 },
    { time: '4 PM', temperature: 75, condition: 'Sunny', precipitation: 0 },
    { time: '5 PM', temperature: 74, condition: 'Sunny', precipitation: 0 },
    { time: '6 PM', temperature: 72, condition: 'Partly Cloudy', precipitation: 0 },
    { time: '7 PM', temperature: 70, condition: 'Partly Cloudy', precipitation: 0 },
    { time: '8 PM', temperature: 68, condition: 'Partly Cloudy', precipitation: 0 },
    { time: '9 PM', temperature: 67, condition: 'Clear', precipitation: 0 },
    { time: '10 PM', temperature: 66, condition: 'Clear', precipitation: 0 },
    { time: '11 PM', temperature: 65, condition: 'Clear', precipitation: 0 },
  ]);
  
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([
    { id: 'loc1', name: 'New York', country: 'United States', temperature: 65, condition: 'Cloudy' },
    { id: 'loc2', name: 'London', country: 'United Kingdom', temperature: 55, condition: 'Rain' },
    { id: 'loc3', name: 'Tokyo', country: 'Japan', temperature: 70, condition: 'Sunny' }
  ]);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    toast.success(`Weather data for ${searchQuery}`, {
      description: "Updated with latest information"
    });
    
    // Simulate new weather data
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm', 'Snow'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = Math.floor(Math.random() * 50) + 40; // 40-90°F
    
    const newWeather: WeatherData = {
      location: searchQuery,
      country: 'United States', // Simplified
      temperature: randomTemp,
      condition: randomCondition,
      high: randomTemp + Math.floor(Math.random() * 10),
      low: randomTemp - Math.floor(Math.random() * 10),
      feelsLike: randomTemp + Math.floor(Math.random() * 5) - 2,
      humidity: Math.floor(Math.random() * 50) + 30,
      windSpeed: Math.floor(Math.random() * 15) + 1,
      sunrise: '6:15 AM',
      sunset: '8:30 PM',
      precipitation: randomCondition === 'Rain' || randomCondition === 'Thunderstorm' ? Math.floor(Math.random() * 90) + 10 : 0
    };
    
    setCurrentWeather(newWeather);
    setSearchQuery('');
    
    // Add to saved locations if not already there
    if (!savedLocations.some(loc => loc.name.toLowerCase() === searchQuery.toLowerCase())) {
      setSavedLocations([
        ...savedLocations,
        {
          id: `loc${Date.now()}`,
          name: searchQuery,
          country: 'United States',
          temperature: randomTemp,
          condition: randomCondition
        }
      ]);
    }
  };

  const handleRemoveLocation = (id: string) => {
    setSavedLocations(savedLocations.filter(loc => loc.id !== id));
  };

  const handleSelectLocation = (location: SavedLocation) => {
    const newWeather: WeatherData = {
      ...currentWeather,
      location: location.name,
      country: location.country,
      temperature: location.temperature,
      condition: location.condition
    };
    
    setCurrentWeather(newWeather);
    toast.info(`Showing weather for ${location.name}`);
  };

  const getWeatherIcon = (condition: string, size: number = 24) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun size={size} className="text-yellow-400" />;
      case 'partly cloudy':
        return <CloudSun size={size} className="text-gray-300" />;
      case 'cloudy':
        return <Cloud size={size} className="text-gray-300" />;
      case 'rain':
        return <CloudRain size={size} className="text-blue-400" />;
      case 'thunderstorm':
        return <CloudLightning size={size} className="text-yellow-400" />;
      case 'snow':
        return <CloudSnow size={size} className="text-white" />;
      default:
        return <Cloud size={size} className="text-gray-300" />;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleToggleUnit = () => {
    toast.info('Temperature unit switched', {
      description: 'You can customize this in settings'
    });
  };

  return (
    <div className="h-full flex bg-navy-950 text-white">
      {/* Sidebar */}
      <div className="w-80 border-r border-navy-800 flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-navy-800">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search locations..."
              className="pl-9 bg-navy-800 border-navy-700 text-white placeholder:text-white/60 focus:ring-navy-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        
        {/* Locations */}
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="saved">
            <TabsList className="w-full">
              <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
              <TabsTrigger value="nearby" className="flex-1">Nearby</TabsTrigger>
            </TabsList>
            
            <TabsContent value="saved" className="p-0 m-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-3">
                  <div className="space-y-2">
                    {savedLocations.map(location => (
                      <div 
                        key={location.id}
                        className="p-2 hover:bg-navy-800 rounded cursor-pointer"
                        onClick={() => handleSelectLocation(location)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-gray-400">{location.country}</div>
                          </div>
                          <div className="flex items-center">
                            {getWeatherIcon(location.condition, 18)}
                            <span className="ml-1">{location.temperature}°</span>
                            <button 
                              className="ml-2 text-gray-400 hover:text-white p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveLocation(location.id);
                              }}
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {savedLocations.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p>No saved locations</p>
                      <p className="text-sm mt-1">Search for a location to save it</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="nearby" className="p-0 m-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-3">
                  <div className="space-y-2">
                    <div className="p-2 hover:bg-navy-800 rounded cursor-pointer">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Oakland</div>
                          <div className="text-xs text-gray-400">10 miles away</div>
                        </div>
                        <div className="flex items-center">
                          <Sun size={18} className="text-yellow-400" />
                          <span className="ml-1">70°</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 hover:bg-navy-800 rounded cursor-pointer">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">Berkeley</div>
                          <div className="text-xs text-gray-400">12 miles away</div>
                        </div>
                        <div className="flex items-center">
                          <CloudSun size={18} className="text-gray-300" />
                          <span className="ml-1">68°</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 hover:bg-navy-800 rounded cursor-pointer">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">San Jose</div>
                          <div className="text-xs text-gray-400">50 miles away</div>
                        </div>
                        <div className="flex items-center">
                          <Sun size={18} className="text-yellow-400" />
                          <span className="ml-1">74°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Current Weather */}
        <div className="p-6 text-center border-b border-navy-800">
          <div className="flex items-center justify-center mb-2">
            <MapPin size={16} className="mr-1 text-gray-400" />
            <h2 className="text-xl font-medium">{currentWeather.location}</h2>
          </div>
          
          <div className="flex items-center justify-center mb-2">
            {getWeatherIcon(currentWeather.condition, 48)}
          </div>
          
          <div className="text-6xl font-light mb-2">
            {currentWeather.temperature}°
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs align-top mt-2 ml-1"
              onClick={handleToggleUnit}
            >
              F
            </Button>
          </div>
          
          <div className="text-xl mb-1">{currentWeather.condition}</div>
          <div className="text-gray-400 flex items-center justify-center">
            H: {currentWeather.high}° L: {currentWeather.low}°
          </div>
        </div>
        
        {/* Weather Tabs */}
        <Tabs defaultValue="hourly" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full border-b border-navy-800 py-1 rounded-none bg-transparent justify-start gap-2 px-4">
            <TabsTrigger value="hourly" className="data-[state=active]:bg-navy-800">Hourly</TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-navy-800">Daily</TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-navy-800">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hourly" className="p-0 m-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="py-4 px-6">
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {hourlyForecast.map((hour, index) => (
                    <div key={index} className="flex flex-col items-center min-w-[60px]">
                      <div className="text-sm mb-2">{hour.time}</div>
                      <div className="mb-2">
                        {getWeatherIcon(hour.condition, 24)}
                      </div>
                      <div className="text-lg">{hour.temperature}°</div>
                      {hour.precipitation > 0 && (
                        <div className="flex items-center text-xs text-blue-400 mt-1">
                          <Droplets size={12} className="mr-0.5" />
                          <span>{hour.precipitation}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-navy-800 p-4 rounded-lg">
                    <h3 className="text-sm mb-2 text-gray-400">Precipitation</h3>
                    <div className="flex space-x-2 overflow-hidden">
                      {[0, 0, 0, 20, 40, 60, 80, 40, 20, 0, 0, 0].map((precip, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="text-xs mb-1">{index + 1}</div>
                          <div 
                            className="w-full bg-blue-500 opacity-30 rounded-sm" 
                            style={{ height: `${precip}%`, minHeight: '4px' }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-gray-400 text-center">Precipitation forecast (12 hours)</div>
                  </div>
                  
                  <div className="bg-navy-800 p-4 rounded-lg">
                    <h3 className="text-sm mb-2 text-gray-400">Wind</h3>
                    <div className="flex items-center justify-center mb-2">
                      <Wind size={32} className="text-gray-300" />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">{currentWeather.windSpeed} mph</div>
                      <div className="text-xs text-gray-400">Wind from NW</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="daily" className="p-0 m-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="space-y-3">
                  {forecast.map((day, index) => (
                    <div 
                      key={index} 
                      className="flex items-center p-2 hover:bg-navy-800 rounded cursor-pointer"
                    >
                      <div className="w-16 text-gray-400">{day.day}</div>
                      <div className="w-12">
                        {getWeatherIcon(day.condition, 24)}
                      </div>
                      <div className="flex-1 flex items-center">
                        {day.precipitation > 0 && (
                          <div className="flex items-center text-xs text-blue-400 mr-4">
                            <Droplets size={12} className="mr-0.5" />
                            <span>{day.precipitation}%</span>
                          </div>
                        )}
                        <div className="flex-1 h-1 bg-navy-800 rounded">
                          <div 
                            className="h-1 bg-gradient-to-r from-blue-500 to-red-500 rounded"
                            style={{ width: '70%' }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 flex justify-between">
                        <span className="text-gray-400">{day.low}°</span>
                        <span>{day.high}°</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-navy-800 p-4 rounded-lg">
                  <h3 className="text-sm mb-3 font-medium">10-Day Forecast Summary</h3>
                  <p className="text-sm text-gray-300">
                    Expect mostly sunny conditions through the early part of the week with 
                    temperatures in the mid-70s. A weather system will move in around Thursday 
                    bringing rain and slightly cooler temperatures. The weekend should clear up 
                    with sunny skies returning.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="details" className="p-0 m-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-navy-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Thermometer size={18} className="text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium">Feels Like</h3>
                    </div>
                    <div className="text-2xl">{currentWeather.feelsLike}°</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Similar to the actual temperature
                    </div>
                  </div>
                  
                  <div className="bg-navy-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Droplets size={18} className="text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium">Humidity</h3>
                    </div>
                    <div className="text-2xl">{currentWeather.humidity}%</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Dew point: 58°
                    </div>
                  </div>
                  
                  <div className="bg-navy-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Wind size={18} className="text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium">Wind</h3>
                    </div>
                    <div className="text-2xl">{currentWeather.windSpeed} mph</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Direction: NW
                    </div>
                  </div>
                  
                  <div className="bg-navy-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Sun size={18} className="text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium">UV Index</h3>
                    </div>
                    <div className="text-2xl">5</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Moderate
                    </div>
                  </div>
                  
                  <div className="bg-navy-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CloudSun size={18} className="text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium">Sunrise & Sunset</h3>
                    </div>
                    <div className="flex justify-between mt-2">
                      <div>
                        <div className="text-sm">Sunrise</div>
                        <div className="text-xl">{currentWeather.sunrise}</div>
                      </div>
                      <div>
                        <div className="text-sm">Sunset</div>
                        <div className="text-xl">{currentWeather.sunset}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-navy-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Globe size={18} className="text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium">Air Quality</h3>
                    </div>
                    <div className="text-2xl">Good</div>
                    <div className="text-xs text-gray-400 mt-1">
                      AQI: 32
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WeatherApp;
