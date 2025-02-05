import React, { useState, useEffect } from "react";
import { getWeatherByCity } from "./WeatherService";
import "./Weather.css"; 

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [backgroundClass, setBackgroundClass] = useState("default");

  const fetchWeather = async () => {
    if (!city) return;
    const data = await getWeatherByCity(city);
    setWeather(data);
  };

  useEffect(() => {
    if (weather) {
      const weatherMain = weather.weather[0].main.toLowerCase();
        if (weatherMain.includes("clear")) {
            setBackgroundClass("sunny");
        } 
        else if (weatherMain.includes("cloud")) {
            setBackgroundClass("cloudy");
        }
        else if (weatherMain.includes("mist") || weatherMain.includes("fog")) {
            setBackgroundClass("foggy");
        } 
        else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
            setBackgroundClass("rainy");
        } 
        else if (weatherMain.includes("thunderstorm")) {
            setBackgroundClass("stormy");
        } 
        else if (weatherMain.includes("snow")) {
            setBackgroundClass("snowy");
        } 
        else {
            setBackgroundClass("default");
        }
    }
  }, [weather]);

  return (
    <div className={`weather-container ${backgroundClass}`}>
      <h2>Rechercher une ville</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Entrez une ville"
      />
      <button onClick={fetchWeather}>Voir la météo</button>

      {weather && (
        <div className="weather-card">
          <h3>{weather.name}, {weather.sys.country}</h3>
          <p className="temperature">{weather.main.temp}°C</p>
          <p className="description">{weather.weather[0].description}</p>
          <p>Vent : {weather.wind.speed} m/s</p>
          <p>Humidité : {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
