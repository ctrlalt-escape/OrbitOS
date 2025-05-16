import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Cloud, CloudRain, CloudSnow, CloudLightning, Sun, Droplets, Wind, Thermometer, MapPin, Globe, CloudSun, CloudMoon } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

// Define API key - in a real app, this would be in an environment variable
const API_KEY = '5a2f7c004ae14579bf8161926242105';
const BASE_URL = 'https://api.weatherapi.com/v1';

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

interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

interface SavedLocation {
  id: string;
  name: string;
  country: string;
  temperature: number;
  condition: string;
}

interface ApiWeatherResponse {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_f: number;
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    feelslike_f: number;
    feelslike_c: number;
    humidity: number;
    wind_mph: number;
    wind_kph: number;
    precip_in: number;
    precip_mm: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_f: number;
        maxtemp_c: number;
        mintemp_f: number;
        mintemp_c: number;
        condition: {
          text: string;
        };
        daily_chance_of_rain: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
      };
      hour: Array<{
        time: string;
        temp_f: number;
        temp_c: number;
        condition: {
          text: string;
        };
        chance_of_rain: number;
      }>;
    }>;
  };
}

async function fetchWeatherData(location: string): Promise<ApiWeatherResponse> {
  const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=no`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  return response.json();
}

async function searchLocations(query: string): Promise<any[]> {
  if (!query.trim()) return [];
  
  const response = await fetch(`${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error('Failed to search locations');
  }
  
  return response.json();
}

// Convert API response to our WeatherData format
function mapApiToWeatherData(data: ApiWeatherResponse): WeatherData {
  const firstForecastDay = data.forecast?.forecastday[0];
  
  return {
    location: data.location.name,
    country: data.location.country,
    temperature: Math.round(data.current.temp_f),
    condition: data.current.condition.text,
    high: firstForecastDay ? Math.round(firstForecastDay.day.maxtemp_f) : Math.round(data.current.temp_f) + 5,
    low: firstForecastDay ? Math.round(firstForecastDay.day.mintemp_f) : Math.round(data.current.temp_f) - 5,
    feelsLike: Math.round(data.current.feelslike_f),
    humidity: data.current.humidity,
    windSpeed: Math.round(data.current.wind_mph),
    sunrise: firstForecastDay?.astro.sunrise || '6:15 AM',
    sunset: firstForecastDay?.astro.sunset || '8:30 PM',
    precipitation: firstForecastDay?.day.daily_chance_of_rain || 0
  };
}

// Convert API forecast to our ForecastDay format
function mapApiToForecastDays(data: ApiWeatherResponse): ForecastDay[] {
  if (!data.forecast) return [];
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return data.forecast.forecastday.map(day => {
    const date = new Date(day.date);
    return {
      day: days[date.getDay()],
      condition: day.day.condition.text,
      high: Math.round(day.day.maxtemp_f),
      low: Math.round(day.day.mintemp_f),
      precipitation: day.day.daily_chance_of_rain
    };
  });
}

// Convert API hourly forecast to our HourlyForecast format
function mapApiToHourlyForecast(data: ApiWeatherResponse): HourlyForecast[] {
  if (!data.forecast) return [];
  
  // Get today's hourly forecast
  const today = data.forecast.forecastday[0].hour;
  const now = new Date();
  const currentHour = now.getHours();
  
  // Get the next 12 hours from current hour
  const next12Hours = [
    ...today.slice(currentHour),
    ...data.forecast.forecastday[1]?.hour.slice(0, currentHour) || []
  ].slice(0, 12);
  
  return next12Hours.map((hour, index) => {
    const hourTime = new Date(hour.time);
    const timeString = index === 0 ? 'Now' : hourTime.toLocaleTimeString([], { hour: 'numeric' });
    
    return {
      time: timeString,
      temperature: Math.round(hour.temp_f),
      condition: hour.condition.text,
      precipitation: hour.chance_of_rain
    };
  });
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
  
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([
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
    { time: '11 PM', temperature: 65, condition: 'Clear', precipitation: 0 }
  ]);
  
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([
    { id: 'loc1', name: 'New York', country: 'United States', temperature: 65, condition: 'Cloudy' },
    { id: 'loc2', name: 'London', country: 'United Kingdom', temperature: 55, condition: 'Rain' },
    { id: 'loc3', name: 'Tokyo', country: 'Japan', temperature: 70, condition: 'Sunny' }
  ]);

  const [useMetric, setUseMetric] = useState<boolean>(false);
  const [nearbyLocations, setNearbyLocations] = useState<SavedLocation[]>([]);

  // Fetch default weather data on component mount
  const { isLoading: isLoadingDefaultLocation } = useQuery({
    queryKey: ['weatherData', 'San Francisco'],
    queryFn: () => fetchWeatherData('San Francisco'),
    onSettled: (data, error) => {
      if (data) {
        updateWeatherData(data);
      }
      if (error) {
        console.error('Error fetching default weather data:', error);
        toast.error('Failed to fetch default weather data');
      }
    }
  });

  // Fetch weather data when user searches for a location
  const { isLoading: isSearching, refetch: refetchWeather } = useQuery({
    queryKey: ['weatherData', searchQuery],
    queryFn: () => fetchWeatherData(searchQuery),
    enabled: false, // Don't run on component mount, only when manually triggered
    onSettled: (data, error) => {
      if (data) {
        updateWeatherData(data);
        addToSavedLocations(data);
        setSearchQuery('');
      }
      if (error) {
        console.error('Error fetching weather data:', error);
        toast.error('Failed to find location. Please try another search term.');
      }
    }
  });

  // Function to update all weather data from API response
  const updateWeatherData = (data: ApiWeatherResponse) => {
    setCurrentWeather(mapApiToWeatherData(data));
    setForecast(mapApiToForecastDays(data));
    setHourlyForecast(mapApiToHourlyForecast(data));
  };

  // Add searched location to saved locations if not already there
  const addToSavedLocations = (data: ApiWeatherResponse) => {
    if (!savedLocations.some(loc => 
      loc.name.toLowerCase() === data.location.name.toLowerCase() && 
      loc.country === data.location.country)) {
      
      const newLocation: SavedLocation = {
        id: `loc${Date.now()}`,
        name: data.location.name,
        country: data.location.country,
        temperature: Math.round(data.current.temp_f),
        condition: data.current.condition.text
      };
      
      setSavedLocations([...savedLocations, newLocation]);
      toast.success(`Added ${data.location.name} to saved locations`);
    }
  };
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    refetchWeather();
  };

  const handleRemoveLocation = (id: string) => {
    setSavedLocations(savedLocations.filter(loc => loc.id !== id));
    toast.info('Location removed from saved list');
  };

  const handleSelectLocation = (location: SavedLocation) => {
    fetchWeatherData(location.name)
      .then(data => {
        updateWeatherData(data);
        toast.info(`Showing weather for ${location.name}`);
      })
      .catch(error => {
        console.error('Error fetching location weather:', error);
        toast.error('Failed to fetch weather data for this location');
      });
  };

  const getWeatherIcon = (condition: string, size: number = 24) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return <Sun size={size} className="text-yellow-400" />;
    } else if (conditionLower.includes('partly cloudy')) {
      return <CloudSun size={size} className="text-gray-300" />;
    } else if (conditionLower.includes('cloudy') || conditionLower.includes('overcast')) {
      return <Cloud size={size} className="text-gray-300" />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
      return <CloudRain size={size} className="text-blue-400" />;
    } else if (conditionLower.includes('thunder') || conditionLower.includes('lightning')) {
      return <CloudLightning size={size} className="text-yellow-400" />;
    } else if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('ice')) {
      return <CloudSnow size={size} className="text-white" />;
    } else {
      return <Cloud size={size} className="text-gray-300" />;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleToggleUnit = () => {
    setUseMetric(!useMetric);
    toast.info(`Temperature unit switched to ${useMetric ? 'Fahrenheit' : 'Celsius'}`);
  };

  // Effect to fetch nearby locations
  useEffect(() => {
    // For demonstration, we'll use a geolocation API in a real app
    // For now, we'll set static nearby locations based on current location
    if (currentWeather.location) {
      // This would be replaced by a real API call in a production app
      const mockNearbyLocations: SavedLocation[] = [
        { 
          id: 'nearby1', 
          name: currentWeather.location === 'San Francisco' ? 'Oakland' : 'Nearby City 1', 
          country: currentWeather.country, 
          temperature: currentWeather.temperature - 2, 
          condition: currentWeather.condition 
        },
        { 
          id: 'nearby2', 
          name: currentWeather.location === 'San Francisco' ? 'Berkeley' : 'Nearby City 2', 
          country: currentWeather.country, 
          temperature: currentWeather.temperature - 4, 
          condition: currentWeather.condition 
        },
        { 
          id: 'nearby3', 
          name: currentWeather.location === 'San Francisco' ? 'San Jose' : 'Nearby City 3', 
          country: currentWeather.country, 
          temperature: currentWeather.temperature + 2, 
          condition: currentWeather.condition 
        }
      ];
      setNearbyLocations(mockNearbyLocations);
    }
  }, [currentWeather.location]);

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
                            <span className="ml-1">
                              {useMetric ? Math.round((location.temperature - 32) * 5/9) : location.temperature}°
                              {useMetric ? 'C' : 'F'}
                            </span>
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
                    {nearbyLocations.map(location => (
                      <div 
                        key={location.id}
                        className="p-2 hover:bg-navy-800 rounded cursor-pointer"
                        onClick={() => handleSelectLocation(location)}
                      >
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-gray-400">Nearby</div>
                          </div>
                          <div className="flex items-center">
                            {getWeatherIcon(location.condition, 18)}
                            <span className="ml-1">
                              {useMetric ? Math.round((location.temperature - 32) * 5/9) : location.temperature}°
                              {useMetric ? 'C' : 'F'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
            {useMetric ? Math.round((currentWeather.temperature - 32) * 5/9) : currentWeather.temperature}°
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs align-top mt-2 ml-1"
              onClick={handleToggleUnit}
            >
              {useMetric ? 'C' : 'F'}
            </Button>
          </div>
          
          <div className="text-xl mb-1">{currentWeather.condition}</div>
          <div className="text-gray-400 flex items-center justify-center">
            H: {useMetric ? Math.round((currentWeather.high - 32) * 5/9) : currentWeather.high}° 
            L: {useMetric ? Math.round((currentWeather.low - 32) * 5/9) : currentWeather.low}°
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
                      <div className="text-lg">
                        {useMetric ? Math.round((hour.temperature - 32) * 5/9) : hour.temperature}°
                      </div>
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
                      {hourlyForecast.map((hour, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="text-xs mb-1">{index + 1}</div>
                          <div 
                            className="w-full bg-blue-500 opacity-30 rounded-sm" 
                            style={{ height: `${hour.precipitation}%`, minHeight: '4px' }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-1 text-xs text-gray-400 text-center">Precipitation forecast ({hourlyForecast.length} hours)</div>
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
                        <span className="text-gray-400">
                          {useMetric ? Math.round((day.low - 32) * 5/9) : day.low}°
                        </span>
                        <span>
                          {useMetric ? Math.round((day.high - 32) * 5/9) : day.high}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 bg-navy-800 p-4 rounded-lg">
                  <h3 className="text-sm mb-3 font-medium">7-Day Forecast Summary</h3>
                  <p className="text-sm text-gray-300">
                    {forecast.length > 0 ? (
                      <>
                        Expect {forecast[0].condition.toLowerCase()} conditions today with 
                        temperatures reaching {useMetric ? Math.round((forecast[0].high - 32) * 5/9) : forecast[0].high}°{useMetric ? 'C' : 'F'}. 
                        {forecast.some(day => day.precipitation > 50) ? 
                          " Watch for rain in the forecast this week." : 
                          " Generally clear conditions expected throughout the week."}
                      </>
                    ) : (
                      "Forecast data is being loaded..."
                    )}
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
                    <div className="text-2xl">
                      {useMetric ? Math.round((currentWeather.feelsLike - 32) * 5/9) : currentWeather.feelsLike}°
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {currentWeather.feelsLike > currentWeather.temperature ? "Feels warmer than actual temperature" : 
                       currentWeather.feelsLike < currentWeather.temperature ? "Feels cooler than actual temperature" : 
                       "Similar to the actual temperature"}
                    </div>
                  </div>
                  
                  <div className="bg-navy-800 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Droplets size={18} className="text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium">Humidity</h3>
                    </div>
                    <div className="text-2xl">{currentWeather.humidity}%</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {currentWeather.humidity > 70 ? "High humidity" : 
                       currentWeather.humidity < 30 ? "Low humidity" : 
                       "Moderate humidity"}
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
                    <div className="text-2xl">
                      {currentWeather.condition.toLowerCase().includes('sunny') ? 5 : 
                       currentWeather.condition.toLowerCase().includes('cloud') ? 3 : 2}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {currentWeather.condition.toLowerCase().includes('sunny') ? "Moderate" : 
                       currentWeather.condition.toLowerCase().includes('cloud') ? "Low" : "Low"}
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
                    <div className="text-2xl">
                      {currentWeather.condition.toLowerCase().includes('rain') ? "Good" :
                       currentWeather.condition.toLowerCase().includes('cloud') ? "Moderate" : 
                       "Good"}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      AQI: {currentWeather.condition.toLowerCase().includes('rain') ? 32 :
                            currentWeather.condition.toLowerCase().includes('cloud') ? 54 : 
                            45}
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
