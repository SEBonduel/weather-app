import React, { useState } from "react";
import Weather from "./Weather";
import './App.css';
import Navbar from "./Navbar";

function App() {
  const [city, setCity] = useState("");
  const [backgroundClass, setBackgroundClass] = useState("default");

  const handleSearch = (newCity) => {
    setCity(newCity);  // Met à jour la ville
  };

  const handleBackgroundChange = (newClass) => {
    setBackgroundClass(newClass);  // Met à jour l'arrière-plan
  };

  return (
    <div className={`app-container ${backgroundClass}`}>
      <Navbar onSearch={handleSearch} />
      <Weather city={city} onBackgroundChange={handleBackgroundChange} />
    </div>
  );
}

export default App;