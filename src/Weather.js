import React, { useState, useEffect } from "react";
import { getWeatherByCity } from "./WeatherService";
import countries from "i18n-iso-countries";
import frLocale from "i18n-iso-countries/langs/fr.json";

countries.registerLocale(frLocale);

const Weather = ({ city, onBackgroundChange }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
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
      try {
        const data = await getWeatherByCity(city);
        if (!data || data.cod !== 200) {
          setError("Ville non trouvée, veuillez réessayer");
          setWeather(null);
          return;
        }
        setWeather(data);
        setError(null);
      } catch (err) {
        setError("Erreur de récupération des données météo.");
        setWeather(null);
      }
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

      const updateTime = () => {
        const utcTime = new Date();
        const localTime = new Date((utcTime.getTime() + weather.timezone * 1000) + (utcTime.getTimezoneOffset() * 60000));
        setCurrentTime(localTime);
      };
      
      updateTime();
      const interval = setInterval(updateTime, 1000);

      const options = { hour: "2-digit", minute: "2-digit" };
      setSunrise(new Date((weather.sys.sunrise + weather.timezone) * 1000).toLocaleTimeString("fr-FR", options));
      setSunset(new Date((weather.sys.sunset + weather.timezone) * 1000).toLocaleTimeString("fr-FR", options));
      
      return () => clearInterval(interval);
    } else {
      setOpacity(0);
    }
  }, [weather, onBackgroundChange, backgroundImage]);

  const countryName = weather?.sys?.country ? countries.getName(weather.sys.country, "fr") : "Inconnu";

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
      {error ? (
          <div className="
          ease-in-out z-50 text-2xl fixed flex flex-col font-raleway 
          tracking-[0.1em] font items-center justify-center h-screen w-screen 
          text-white text-center bg-gradient-to-b from-blue-500 to-indigo-600
          lg:text-5xl md:text-3xl sm:text-3xl">
            <p className="m-5">{error} </p>
            <p className="m-5"> 
             <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12 animate-pulse"
              >
                <path d="M12 9v4m0 4h.01" />
                <circle cx="12" cy="12" r="9" />
            </svg>
            </p>
        </div>
      ) : weather ? (
        <>
          <div className="max-w-max relative z-10 lg:h-[380px] md:h-[300px] sm:h-[280px] text-white p-4 justify-center flex flex-col font-raleway tracking-[0.1em] mt-10 ml-10 bg-black bg-opacity-30 pl-10 pr-10 rounded-2xl">
            <h3 className="max-w-max font-semibold lg:text-7xl md:text-5xl sm:text-5xl">
              {currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </h3>
            <h3 className="max-w-max font-semibold lg:text-7xl md:text-5xl sm:text-5xl pb-4">
              {weather.name}, {countryName}
            </h3>
            <p className="max-w-max font-normal lg:text-5xl md:text-3xl sm:text-3xl">
              {weather.weather[0].description.charAt(0).toUpperCase() +
                weather.weather[0].description.slice(1)}, {weather.main.temp}°C
            </p>
            <p className="font-normal lg:text-5xl md:text-3xl sm:text-3xl">Vent : {weather.wind.speed} m/s</p>
            <p className="max-w-max font-normal lg:text-5xl md:text-3xl sm:text-3xl">Humidité : {weather.main.humidity}%</p>
            <p className="max-w-max font-normal lg:text-5xl md:text-3xl sm:text-3xl">
              {currentTime.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }).replace(/^./, (char) => char.toUpperCase())}
            </p>
          </div>
          <div className="absolute bottom-48 top-10 right-8 flex items-center bg-black bg-opacity-30 p-12 rounded-2xl text-white">
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather Icon" className="w-32 h-32" />
          </div>
          <div className="absolute bottom-8 right-8 flex items-center bg-black bg-opacity-30 p-4 rounded-2xl text-white">
            <div className="ml-4 mr-4 text-xl">
              <p>🌅 {sunrise}</p>
              <p>🌙 {sunset}</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Weather;
