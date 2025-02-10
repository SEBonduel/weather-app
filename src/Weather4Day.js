import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion"; // Ajout des animations
import "./App.css";

const Weather4Day = ({ city }) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (!city) return;

    const fetchWeatherData = async () => {
      try {
        const locationRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`
        );
        const { lat, lon } = locationRes.data.coord;

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
        );

        const dailyData = {};
        forecastRes.data.list.forEach((entry) => {
          const date = new Date(entry.dt * 1000).toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          });

          if (!dailyData[date]) {
            dailyData[date] = {
              temp: [],
              weather: entry.weather[0],
            };
          }

          dailyData[date].temp.push(entry.main.temp);
        });

        const processedForecast = Object.keys(dailyData).slice(0, 4).map((date) => {
          const temps = dailyData[date].temp;
          const avgTemp = Math.round(temps.reduce((sum, t) => sum + t, 0) / temps.length);

          return {
            date,
            temp: avgTemp,
            weather: dailyData[date].weather,
          };
        });

        setTimeout(() => {
          setForecast(processedForecast);
          setLoading(false);
          setFirstLoad(false);
        }, firstLoad ? 1500 : 0);
      } catch (error) {
        console.error("Erreur lors de la récupération des prévisions :", error);
        setTimeout(() => {
          setLoading(false);
          setFirstLoad(false);
        }, firstLoad ? 1500 : 0);
      }
    };

    fetchWeatherData();
  }, [city, API_KEY, firstLoad]);

  // Fonction pour déterminer l'image de fond
  const getWeatherBackground = (weatherType) => {
    if (weatherType.includes("clear")) return "/images/sunny2.jpg";
    if (weatherType.includes("cloud")) return "/images/cloudy2.jpg";
    if (weatherType.includes("rain")) return "/images/rainy2.jpg";
    if (weatherType.includes("snow")) return "/images/snowy2.jpg";
    if (weatherType.includes("mist") || weatherType.includes("fog") || weatherType.includes("haze")) return "/images/foggy2.jpg";
    if (weatherType.includes("thunderstorm")) return "/images/thunderstorm2.jpg";
    return "/images/default.jpg";
  };

  return (
    <div className="weather-4day h-[280px] flex justify-center items-center">
      {loading ? (
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            className="animate-spin h-10 w-10 text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <motion.p
            className="mt-2 text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            Chargement...
          </motion.p>
        </motion.div>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
          speed={600}
        >
          {forecast.map((day, index) => {
            const weatherType = day.weather.main.toLowerCase();
            return (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="weather-day p-4 rounded-lg text-white bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${getWeatherBackground(weatherType)})` }}
                >
                  <div className="absolute inset-0 bg-black/30 rounded-lg"></div>

                  <div className="relative z-10 text-center">
                    <h4 className="text-xl font-semibold">{day.date}</h4>
                    <motion.img
                      src={`http://openweathermap.org/img/wn/${day.weather.icon}.png`}
                      alt={day.weather.description}
                      className="mx-auto"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.p
                      className="text-lg font-bold"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {day.temp}°C
                    </motion.p>
                    <p className="capitalize">{day.weather.description}</p>
                  </div>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default Weather4Day;
