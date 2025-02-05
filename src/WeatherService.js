import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherByCity = async (city) => {
  try {
    console.log("API Key:", process.env.REACT_APP_API_KEY);
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric", // Température en Celsius
        lang: "fr", // Langue en français
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données météo", error);
    return null;
  }
};