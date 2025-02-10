import React, { useState } from "react";
import Weather from "./Weather";
import Navbar from "./Navbar";
import Weather4Day from "./Weather4Day"; 
import { motion, AnimatePresence } from "framer-motion"; // Import des animations
import "./App.css";

function App() {
  const [city, setCity] = useState(""); // État pour la ville
  const [backgroundClass, setBackgroundClass] = useState("default"); // État pour la classe de fond

  // Fonction pour gérer la recherche de ville
  const handleSearch = (newCity) => {
    setCity(newCity);
  };

  // Fonction pour gérer le changement de fond
  const handleBackgroundChange = (newClass) => {
    setBackgroundClass(newClass); // Met à jour l'arrière-plan
  };

  return (
    <div className={`app-container ${backgroundClass}`}>
      {/* Navbar pour rechercher une ville */}
      <Navbar onSearch={handleSearch} />

      <AnimatePresence mode="wait">
        {!city && (
          <motion.div
            key="home"
            className="flex flex-col items-center justify-center h-screen text-white text-center bg-gradient-to-b from-blue-500 to-indigo-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <h1 className="ml-6 mr-6 text-3xl lg:text-5xl md:text-4xl sm:text-4xl font-bold mb-10">Bienvenue sur See Weather 🌤️</h1>
            <p className="ml-6 mr-6 text-l mb-2 lg:text-2xl md:text-2xl sm:text-2xl mb-4">Recherchez une ville pour voir la météo en temps réel ainsi que sur les 4 prochains jours.</p>
            <p className="ml-6 mr-6 text-l mb-2 lg:text-2xl md:text-2xl sm:text-2xl mb-12">Vous pouvez préciser de quel pays il s'agit dans la recherche en cas d'homonyme, par exemple : "Brest, France".</p>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <svg className="items-center justify-center w-16 h-16 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 3a7 7 0 00-7 7c0 2.666 1.333 4.667 2.5 6 .5.5 1.5 1.5 1.5 2 0 .667-.5 1.5-1.5 1.5s-1.5-.833-1.5-1.5h-2c0 2.167 1.5 3.5 3.5 3.5S8 21.167 8 19.5c0-.5-1-1.5-1.5-2C5.333 16 4 14 4 11a5 5 0 0110 0h2a7 7 0 00-7-7zm3 6h2a3 3 0 013 3 3 3 0 01-3 3h-2a3 3 0 01-3-3 3 3 0 013-3zm0 2a1 1 0 00-1 1 1 1 0 001 1h2a1 1 0 001-1 1 1 0 00-1-1h-2z"></path>
              </svg>
            </motion.div>
          </motion.div>
        )}

        {/* Météo et prévisions avec transition */}
        {city && (
          <motion.div
            key="weather"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Météo actuelle */}
            <Weather city={city} onBackgroundChange={handleBackgroundChange} />
            {/* Prévisions sur 4 jours */}
            <Weather4Day city={city} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
