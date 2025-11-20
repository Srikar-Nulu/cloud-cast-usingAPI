import { useState } from "react";
import { Cloud, Droplets, Wind, Search, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    description: string;
    main: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

const WeatherCard = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

 const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!city.trim()) {
      toast({
        title: "Please enter a city name",
        variant: "destructive",
      });
      return;
    }

    if (API_KEY === "YOUR_API_KEY_HERE") {
      toast({
        title: "API Key Required",
        description: "Please add your OpenWeatherMap API key to fetch weather data.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "City not found",
            description: "Please check the spelling and try again.",
            variant: "destructive",
          });
        } else {
          throw new Error("Failed to fetch weather data");
        }
        setWeather(null);
        return;
      }

      const data = await response.json();
      setWeather(data);
      toast({
        title: "Weather updated",
        description: `Showing weather for ${data.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
      console.error("Weather fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center p-4 animate-in fade-in duration-700">
      <Card className="w-full max-w-md backdrop-blur-xl bg-weather-glass/70 shadow-glass border-white/20 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              <Cloud className="h-8 w-8 text-primary" />
              Weather Forecast
            </h1>
            <p className="text-muted-foreground">Get real-time weather updates</p>
          </div>

          {/* Search Section */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-background/50 border-border/50 focus:bg-background transition-smooth"
                disabled={loading}
              />
            </div>
            <Button
              onClick={fetchWeather}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 transition-smooth"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Weather Display */}
          {weather && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
              {/* City Name */}
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">
                  {weather.name}
                </h2>
              </div>

              {/* Main Weather Info */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt={weather.weather[0].description}
                    className="w-32 h-32 drop-shadow-lg"
                  />
                </div>
                
                <div>
                  <div className="text-6xl font-bold text-foreground">
                    {Math.round(weather.main.temp)}°
                  </div>
                  <div className="text-lg text-muted-foreground capitalize mt-2">
                    {weather.weather[0].description}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Feels like {Math.round(weather.main.feels_like)}°
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/40 rounded-lg p-4 backdrop-blur-sm space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {weather.main.humidity}%
                  </div>
                </div>

                <div className="bg-background/40 rounded-lg p-4 backdrop-blur-sm space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wind className="h-4 w-4" />
                    <span className="text-sm">Wind Speed</span>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {Math.round(weather.wind.speed)} m/s
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!weather && !loading && (
            <div className="text-center py-12 space-y-3 animate-in fade-in duration-500">
              <Cloud className="h-16 w-16 mx-auto text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Enter a city name to get started
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WeatherCard;
