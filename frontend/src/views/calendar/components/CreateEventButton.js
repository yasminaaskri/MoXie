// CreateEventButton.js - Bouton amélioré
import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { FiPlus } from "react-icons/fi";
import { FaUniversalAccess } from "react-icons/fa";

export default function CreateEventButton() {
  const { setShowEventModal } = useContext(GlobalContext);
  
  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowEventModal(true);
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={() => setShowEventModal(true)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
        aria-label="Créer un nouvel événement"
        tabIndex="0"
      >
        <FiPlus className="w-5 h-5" />
        <span>Créer une réunion</span>
        <div className="absolute -top-2 -right-2">
          <FaUniversalAccess className="w-4 h-4 text-green-400" />
        </div>
      </button>
      
      {/* Tooltip d'accessibilité */}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
        Accessible aux lecteurs d'écran
      </div>
    </div>
  );
}