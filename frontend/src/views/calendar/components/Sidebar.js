// Sidebar améliorée avec accessibilité
import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import Labels from "./Labels";
import { FiFilter, FiDownload, FiHelpCircle } from "react-icons/fi";
import { FaUniversalAccess, FaAudioDescription } from "react-icons/fa";

export default function Sidebar() {
  const { labels, updateLabel } = useContext(GlobalContext);

  return (
    <aside 
      className="w-64 lg:w-80 border-r border-gray-200 p-6 bg-gradient-to-b from-white to-gray-50"
      aria-label="Panneau latéral du calendrier"
    >
      {/* Bouton créer */}
      <div className="mb-8">
        <CreateEventButton />
      </div>

      {/* Calendrier miniature */}
      <div className="mb-8">
        <SmallCalendar />
      </div>

      {/* Section accessibilité */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-green-800 font-semibold mb-3">
          <FaUniversalAccess className="w-5 h-5" />
          Fonctions d'accessibilité
        </div>
        <ul className="space-y-2 text-sm text-green-700">
          <li className="flex items-center gap-2">
            <FaAudioDescription className="w-4 h-4" />
            Compatible lecteur d'écran
          </li>
          <li className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black text-white text-xs flex items-center justify-center">A</div>
            Contraste élevé
          </li>
          <li className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-gray-800 text-white text-xs rounded">Tab</kbd>
            Navigation au clavier
          </li>
          <li className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            Indicateurs visuels pour daltoniens
          </li>
        </ul>
      </div>

      {/* Filtres */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 flex items-center gap-2">
            <FiFilter /> Filtres
          </h3>
          <button 
            className="text-sm text-indigo-600 hover:text-indigo-800"
            aria-label="Réinitialiser les filtres"
          >
            Tout effacer
          </button>
        </div>
        <Labels />
      </div>

      {/* Aide rapide */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <FiHelpCircle />
          <span className="font-medium">Raccourcis clavier</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-gray-100 rounded p-2">
            <kbd className="font-mono bg-gray-800 text-white px-1 rounded">Tab</kbd>
            <span className="ml-2 text-gray-600">Navigation</span>
          </div>
          <div className="bg-gray-100 rounded p-2">
            <kbd className="font-mono bg-gray-800 text-white px-1 rounded">Espace</kbd>
            <span className="ml-2 text-gray-600">Sélectionner</span>
          </div>
          <div className="bg-gray-100 rounded p-2">
            <kbd className="font-mono bg-gray-800 text-white px-1 rounded">Echap</kbd>
            <span className="ml-2 text-gray-600">Fermer</span>
          </div>
          <div className="bg-gray-100 rounded p-2">
            <kbd className="font-mono bg-gray-800 text-white px-1 rounded">C</kbd>
            <span className="ml-2 text-gray-600">Créer</span>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="mt-6">
        <button
          className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Exporter le calendrier"
        >
          <FiDownload />
          <span>Exporter calendrier</span>
        </button>
      </div>
    </aside>
  );
}