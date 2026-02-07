// Month.js - Amélioré pour accessibilité
import React from "react";
import Day from "./Day";

export default function Month({ month }) {
  return (
    <div 
      className="flex-1 grid grid-cols-7 grid-rows-5 gap-0.5 p-1 bg-gray-50"
      role="grid"
      aria-label="Calendrier du mois"
    >
      {/* En-têtes des jours de la semaine avec ARIA */}
      <div className="hidden lg:contents" role="presentation">
        {['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map((day, i) => (
          <div 
            key={i}
            className="p-3 text-center bg-white border-b border-gray-200"
            role="columnheader"
            aria-label={day}
          >
            <span className="font-semibold text-gray-700">{day.charAt(0)}</span>
            <span className="hidden lg:inline text-sm text-gray-500 ml-1">{day.substring(1, 3)}</span>
          </div>
        ))}
      </div>
      
      {/* Jours du mois */}
      {month.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((day, idx) => (
            <Day 
              key={idx} 
              day={day} 
              rowIdx={i} 
              aria-label={`Jour ${day.format('DD MMMM YYYY')}`}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}