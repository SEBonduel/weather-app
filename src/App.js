import React, { useState } from "react";
import Weather from "./Weather"; // Composant pour la météo actuelle
import './App.css';
import Navbar from "./Navbar"; // Navbar pour la recherche
import Weather7Day from "./Weather4Day"; // Composant pour les prévisions sur 7 jours

function App() {
  const [city, setCity] = useState(""); // État pour la ville
  const [backgroundClass, setBackgroundClass] = useState("default"); // État pour la classe de fond

  // Fonction pour gérer la recherche de ville
  const handleSearch = (newCity) => {
    setCity(newCity);  // Met à jour la ville
  };

  // Fonction pour gérer le changement de fond
  const handleBackgroundChange = (newClass) => {
    setBackgroundClass(newClass);  // Met à jour l'arrière-plan
  };

  return (
    <div className={`app-container ${backgroundClass}`}>
      {/* Navbar qui gère la recherche de ville */}
      <Navbar onSearch={handleSearch} />

      {/* Météo actuelle */}
      <Weather city={city} onBackgroundChange={handleBackgroundChange} />

      {/* Prévisions sur 7 jours */}
      <Weather7Day city={city} />
    </div>
  );
}

export default App;
