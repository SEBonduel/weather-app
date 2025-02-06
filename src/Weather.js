import React, { useState, useEffect } from "react";
import { getWeatherByCity } from "./WeatherService";

const Weather = ({ city, onBackgroundChange }) => {
  const [weather, setWeather] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [prevBackgroundImage, setPrevBackgroundImage] = useState(""); // Image précédente
  const [isTransitioning, setIsTransitioning] = useState(false); // Gérer la transition
  const [opacity, setOpacity] = useState(0); // Gérer l'opacité de la nouvelle image

  const fetchWeather = async () => {
    if (!city) return;
    const data = await getWeatherByCity(city);
    setWeather(data);
  };

  useEffect(() => {
    fetchWeather();  // Appelle fetchWeather chaque fois que la ville change
  }, [city]);

  useEffect(() => {
    if (weather) {
      const weatherMain = weather.weather[0].main.toLowerCase();
      let imageUrl = "";

      // Choisir l'image en fonction du type de météo
      if (weatherMain.includes("clear")) {
        imageUrl = "/images/sunny.jpg"; // Image pour ciel clair
      } else if (weatherMain.includes("cloud")) {
        imageUrl = "/images/cloudy.jpg"; // Image pour nuages
      } else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
        imageUrl = "/images/rainy.jpg"; // Image pour pluie
      } else if (weatherMain.includes("snow")) {
        imageUrl = "/images/snowy.jpg"; // Image pour neige
      } else {
        imageUrl = "/images/default.jpg"; // Image par défaut
      }

      // Si l'image change, on commence la transition
      if (imageUrl !== backgroundImage) {
        setPrevBackgroundImage(backgroundImage); // Sauvegarder l'ancienne image
        setIsTransitioning(true); // Activer la transition
        setOpacity(0); // Faire disparaître l'ancienne image
      }

      // Après un délai, afficher la nouvelle image en douceur
      setTimeout(() => {
        setBackgroundImage(imageUrl); // Mettre à jour l'image
        setOpacity(1); // Afficher la nouvelle image progressivement
      }, 300); // 300ms pour laisser le temps à l'ancienne image de disparaître

      // Mettre à jour la classe d'arrière-plan
      onBackgroundChange(weatherMain);
    } else {
      setOpacity(0); // Si aucune météo n'est chargée, on cache l'image
    }
  }, [weather, onBackgroundChange, backgroundImage]);

  return (
    <div className="relative w-full h-[450px] bg-cover bg-center overflow-hidden">
      {/* Ancienne image, elle devient transparente durant la transition */}
      {prevBackgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${prevBackgroundImage})`,
            opacity: opacity === 1 ? 0 : 1, // Disparition de l'ancienne image
          }}
        ></div>
      )}

      {/* Nouvelle image avec transition d'opacité */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          opacity: opacity, // Apparition progressive de la nouvelle image
        }}
      ></div>

      {/* Contenu */}
      {weather && (
        
        <div className="max-w-max relative z-10 h-[380px] text-white p-4 justify-center flex flex-col font-raleway tracking-[0.1em] mt-10 ml-10 bg-black bg-opacity-30 pl-10 pr-10 rounded-2xl">
          <h3 className="max-w-max font-semibold text-7xl">{weather.name}, {new Date(weather.dt * 1000).toLocaleTimeString()}</h3> 
          {/* , {weather.sys.country} pour afficher le pays */}
          <p className="max-w-max font-normal text-5xl"></p>
          <p className="max-w-max font-normal text-5xl">{weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}, {weather.main.temp}°C</p>          <p className="font-normal text-5xl">Vent : {weather.wind.speed} m/s</p>
          <p className="max-w-max font-normal text-5xl">Humidité : {weather.main.humidity}%</p>

            <p className="max-w-max font-normal text-5xl">
            {new Date(weather.dt * 1000).toLocaleDateString("fr-FR", {
              weekday: "long", // Nom complet du jour
              day: "numeric", // Jour du mois
              month: "long", // Mois complet
              year: "numeric", // Année complète
            }).replace(/^./, (char) => char.toUpperCase())}  
          </p>

          {/* <p className="font-normal text-3xl">Pression : {weather.main.pressure} hPa</p>
          <p className="font-normal text-3xl">Lever du soleil : {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p className="font-normal text-3xl">Coucher du soleil : {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p> */}
          
        </div>
      )}
    </div>
  );
};

export default Weather;
