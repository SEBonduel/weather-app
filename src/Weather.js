import React, { useState, useEffect } from "react";
import { getWeatherByCity } from "./WeatherService";

const Weather = ({ city, onBackgroundChange }) => {
  const [weather, setWeather] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [prevBackgroundImage, setPrevBackgroundImage] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;
      const data = await getWeatherByCity(city);
      setWeather(data);
    };
    fetchWeather();
  }, [city]);

  useEffect(() => {
    if (weather) {
      const weatherMain = weather.weather[0].main.toLowerCase();
      let imageUrl = "";
      if (weatherMain.includes("clear")) {
        imageUrl = "/images/sunny.jpg";
      } else if (weatherMain.includes("cloud")) {
        imageUrl = "/images/cloudy.jpg";
      } else if (weatherMain.includes("thunderstorm")) {
        imageUrl = "/images/thunderstorm.jpg";
      } else if (weatherMain.includes("mist") || weatherMain.includes("fog") || weatherMain.includes("haze")) {
        imageUrl = "/images/foggy.jpg";
      } else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
        imageUrl = "/images/rainy.jpg";
      } else if (weatherMain.includes("snow")) {
        imageUrl = "/images/snowy.jpg";
      } else {
        imageUrl = "/images/default.jpg";
      }
      if (imageUrl !== backgroundImage) {
        setPrevBackgroundImage(backgroundImage);
        setIsTransitioning(true);
        setOpacity(0);
      }
      setTimeout(() => {
        setBackgroundImage(imageUrl);
        setOpacity(1);
      }, 300);
      onBackgroundChange(weatherMain);
      
      const sunriseTime = new Date(weather.sys.sunrise * 1000).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      const sunsetTime = new Date(weather.sys.sunset * 1000).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      });
      setSunrise(sunriseTime);
      setSunset(sunsetTime);
    } else {
      setOpacity(0);
    }
  }, [weather, onBackgroundChange, backgroundImage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[450px] bg-cover bg-center overflow-hidden">
      {prevBackgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${prevBackgroundImage})`,
            opacity: opacity === 1 ? 0 : 1,
          }}
        ></div>
      )}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          opacity: opacity,
        }}
      ></div>
      {weather && (
        <>
          <div className="max-w-max relative z-10 h-[380px] text-white p-4 justify-center flex flex-col font-raleway tracking-[0.1em] mt-10 ml-10 bg-black bg-opacity-30 pl-10 pr-10 rounded-2xl">
            <h3 className="max-w-max font-semibold text-7xl">
              {currentTime.toLocaleTimeString()}
            </h3>
            <h3 className="max-w-max font-semibold text-7xl pb-4">
              {weather.name}, {weather.sys.country}
            </h3>
            <p className="max-w-max font-normal text-5xl">
              {weather.weather[0].description.charAt(0).toUpperCase() +
                weather.weather[0].description.slice(1)}, {weather.main.temp}°C
            </p>
            <p className="font-normal text-5xl">Vent : {weather.wind.speed} m/s</p>
            <p className="max-w-max font-normal text-5xl">Humidité : {weather.main.humidity}%</p>
            <p className="max-w-max font-normal text-5xl">
              {currentTime.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).replace(/^./, (char) => char.toUpperCase())}
            </p>
          </div>
          <div className="absolute bottom-48 right-8 flex items-center bg-black bg-opacity-30 p-12 rounded-2xl text-white">
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather Icon" className="w-32 h-32" />
          </div>
          <div className="absolute bottom-4 right-8 flex items-center bg-black bg-opacity-30 p-4 rounded-2xl text-white">
            <div className="ml-4 mr-4 text-xl">
            <p>🌅 {sunrise}</p>
            <p>🌙 {sunset}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
