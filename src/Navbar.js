import React, { useState } from "react";
import { X } from "lucide-react"; // Ajout de l'icône X pour la croix

const Navbar = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    onSearch(city); // Appelle la fonction pour envoyer la ville à App.js
  };

  // Fonction pour gérer l'appui sur Entrée
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Lance la recherche si la touche Entrée est pressée
    }
  };

  // Fonction pour vider le champ de recherche
  const handleClear = () => {
    setCity("");
  };

  // Fonction pour recharger la page
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-[#252931] text-white font-raleway tracking-[0.1em]">
      {/* Bouton pour recharger la page vers l'accueil */}
      <button onClick={handleReload} className="mr-1 text-xl lg:ml-4 md:ml-4 sm:ml-4 lg:text-5xl md:text-4xl sm:text-4xl font-light">
        SEE WEATHER
      </button>

      {/* Champ de recherche avec croix pour effacer */}
      <div className="relative lg:w-80 md:w-80 sm:w-72 flex items-center ml-auto lg:mr-4 md:mr-4 sm:mr-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Rechercher une ville"
          onKeyDown={handleKeyPress}
          className="ml-1 w-32 lg:w-full md:w-full sm:w-full px-4 py-2 rounded-full bg-white text-black focus:outline-none"
        />
        {city && (
          <button onClick={handleClear} className="absolute right-3 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
