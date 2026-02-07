// CalendarHeader.js - Header amélioré avec accessibilité
import dayjs from "dayjs";
import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { FaUniversalAccess } from "react-icons/fa";

export default function CalendarHeader() {
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  
  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }
  
  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }
  
  function handleReset() {
    setMonthIndex(dayjs().month());
  }
  
  function handleKeyDown(e, action) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }

  return (
    <header 
      className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200"
      role="banner"
      aria-label="En-tête du calendrier"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm border">
            <FiCalendar className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 
              className="text-2xl font-bold text-gray-800"
              id="calendar-title"
            >
              Calendrier TILI
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <FaUniversalAccess className="w-4 h-4" />
              Accessibilité garantie
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Bouton Today avec meilleur accessibilité */}
          <button
            onClick={handleReset}
            onKeyDown={(e) => handleKeyDown(e, handleReset)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-500 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Aller à aujourd'hui"
            tabIndex="0"
          >
            Aujourd'hui
          </button>
          
          {/* Navigation mois */}
          <div 
            className="flex items-center bg-white rounded-lg border border-gray-300 p-1"
            role="group"
            aria-label="Navigation entre les mois"
          >
            <button
              onClick={handlePrevMonth}
              onKeyDown={(e) => handleKeyDown(e, handlePrevMonth)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              aria-label="Mois précédent"
              tabIndex="0"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <h2 
              className="mx-4 text-lg font-semibold text-gray-800 min-w-[180px] text-center"
              aria-live="polite"
              id="current-month"
            >
              {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            </h2>
            
            <button
              onClick={handleNextMonth}
              onKeyDown={(e) => handleKeyDown(e, handleNextMonth)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              aria-label="Mois suivant"
              tabIndex="0"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Indicateur visuel pour daltoniens */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 rounded-lg">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full" title="Réunion" />
              <div className="w-3 h-3 bg-blue-500 rounded-full" title="Tâche" />
              <div className="w-3 h-3 bg-green-500 rounded-full" title="Événement" />
            </div>
            <span className="text-sm font-medium text-indigo-800">Légende</span>
          </div>
        </div>
      </div>
    </header>
  );
}