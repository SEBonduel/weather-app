import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather7Day = ({ city }) => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch7DayForecast = async () => {
    if (!city) return;
    try {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=metric&lang=fr`
      );
      setForecast(response.data.daily); // Les prévisions sur 7 jours sont dans "daily"
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch7DayForecast();
  }, [city]);

  return (
    <div className="weather-7day">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="weather-day p-4 bg-gray-800 text-white rounded-lg">
              <h4>{new Date(day.dt * 1000).toLocaleDateString()}</h4>
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
              />
              <p>{Math.round(day.temp.day)}°C</p>
              <p>{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Weather7Day;
