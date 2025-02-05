import React, { useState } from "react";
import { Sun, Moon } from "lucide-react"; // Icônes pour le thème et la croix

const Navbar = ({ onThemeToggle, onSearch }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    onSearch(city);  // Appelle la fonction pour envoyer la ville à App.js
  };

  // Fonction pour gérer l'appui sur Entrée
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Lance la recherche si la touche entrée est pressée
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-[#252931] text-white font-raleway tracking-[0.1em]">
      <h1 className="text-5xl font-raleway font-light ">SEE WEATHER</h1>
      
      <div className="relative w-80  flex items-center justify-center ml-auto mr-10">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Rechercher une ville"
          onKeyDown={handleKeyPress}
          className="w-full px-4 py-2 rounded-full bg-white text-black focus:outline-none"
        />
      </div>

      <button onClick={handleSearch} className="p-2  rounded-full bg-[#333940]">
        <Sun size={24} className="hidden dark:block" />
        <Moon size={24} className="dark:hidden" />
      </button>
    </nav>
  );
};

export default Navbar;
