"use client";

import { useState } from "react";

type GeoResponse = {
  results: {
    latitude: number;
    longitude: number;
  }[];
};

type WeatherData = {
  current_weather: {
    temperature: string;
    windspeed: string;
    weathercode: string;
  };
};

export default function Home() {
  const [cityName, setCityName] = useState("");
  const [weathers, setWeathers] = useState<WeatherData | null>(null);

  const getWeatherPosts = async (): Promise<void> => {
    const cityUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}
`;

    try {
      const cityResponse = await fetch(cityUrl);
      const cityData: GeoResponse = await cityResponse.json();
      console.log("geo data:", cityData);

      if (!cityData.results || cityData.results.length === 0) {
        throw new Error("No results found for the city name.");
      }

      const { longitude, latitude } = cityData.results[0];
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true
`;

      const weatherResponse = await fetch(weatherUrl);
      const weatherData: WeatherData = await weatherResponse.json();
      setWeathers(weatherData);
      console.log(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={cityName}
        onChange={(e) => setCityName(e.target.value)}
        placeholder="Enter city name"
        className="bg-amber-100 "
      />
      <button onClick={getWeatherPosts}>Search</button>
      {weathers && (
        <div>
          <h1>{weathers.current_weather.temperature}</h1>
          <h1>{weathers.current_weather.windspeed}</h1>
          <h1>{weathers.current_weather.weathercode}</h1>
        </div>
      )}
    </div>
  );
}
