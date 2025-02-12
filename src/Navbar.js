import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const Navbar = ({ onSearch }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [lastTypedTime, setLastTypedTime] = useState(null);
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (city.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des villes :", error);
      }
    };

    fetchCities();
    setLastTypedTime(Date.now());

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => {
      if (Date.now() - lastTypedTime >= 2000) {
        setSuggestions([]);
      }
    }, 2000));
  }, [city, API_KEY]);

  const handleSearch = (selectedCity) => {
    setCity(selectedCity);
    onSearch(selectedCity);
    setSuggestions([]);

    setSearchHistory((prevHistory) => {
      if (!prevHistory.includes(selectedCity)) {
        const newHistory = [...prevHistory, selectedCity];
        return newHistory.length > 10 ? newHistory.slice(1) : newHistory;
      }
      return prevHistory;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (suggestions.length > 0) {
        handleSearch(`${suggestions[0].name}, ${suggestions[0].country}`);
      } else {
        handleSearch(city);
      }
    }
  };

  const handleClear = () => {
    setCity("");
    setSuggestions([]);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <nav className="flex md:flex-row justify-between items-center p-4 bg-[#252931] text-white font-raleway tracking-[0.1em]">
      <button onClick={handleReload} className="mr-1 text-xl lg:ml-4 md:ml-4 sm:ml-4 lg:text-5xl md:text-4xl sm:text-4xl font-light">
        SEE WEATHER
      </button>

      <div className="relative lg:w-80 md:w-80 sm:w-72 flex items-center ml-auto lg:mr-4 md:mr-4 sm:mr-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Rechercher une ville"
          onKeyDown={handleKeyPress}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
          className="ml-1 w-32 lg:w-full md:w-full sm:w-full px-4 py-2 rounded-full bg-white text-black focus:outline-none"
        />
        {city && (
          <button onClick={handleClear} className="absolute right-1 lg:right-3 md:right-3 sm:right-3 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        )}
        {isInputFocused && (suggestions.length > 0 || searchHistory.length > 0) && (
          <div className="absolute top-12 left-0 w-full bg-white text-black rounded-lg shadow-lg z-100">
            {suggestions.length > 0 && (
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSearch(`${suggestion.name}, ${suggestion.country}`)}
                  >
                    {suggestion.name}, {suggestion.country}
                  </li>
                ))}
              </ul>
            )}
            {searchHistory.length > 0 && (
              <div className="border-t border-gray-300 mt-2 pt-2">
                <p className="px-4 text-gray-600 text-sm">Recherches récentes :</p>
                <ul>
                  {searchHistory.filter((item) => item.toLowerCase().includes(city.toLowerCase())).map((historyItem, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleSearch(historyItem)}
                    >
                      {historyItem}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
