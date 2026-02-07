// SmallCalendar.js - Version améliorée
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { getMonth } from "../util";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(
    dayjs().month()
  );
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

  const {
    monthIndex,
    setSmallCalendarMonth,
    setDaySelected,
    daySelected,
  } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1);
  }
  
  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1);
  }
  
  function handleKeyDown(e, action) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }

  function getDayClass(day) {
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    
    if (nowDay === currDay) {
      return "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-sm";
    } else if (currDay === slcDay) {
      return "bg-indigo-100 text-indigo-700 font-semibold ring-2 ring-indigo-300";
    } else {
      return "hover:bg-gray-100 text-gray-700";
    }
  }
  
  function getWeekendClass(day) {
    const dayOfWeek = day.day();
    return (dayOfWeek === 0 || dayOfWeek === 6) ? "text-red-500" : "text-gray-700";
  }

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4"
      role="complementary"
      aria-label="Calendrier miniature"
    >
      {/* Header du petit calendrier */}
      <header className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg font-semibold text-gray-800"
          id="small-calendar-title"
        >
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format("MMMM YYYY")}
        </h3>
        
        <div 
          className="flex items-center gap-1 bg-gray-50 rounded-lg p-1"
          role="group"
          aria-label="Navigation du calendrier miniature"
        >
          <button
            onClick={handlePrevMonth}
            onKeyDown={(e) => handleKeyDown(e, handlePrevMonth)}
            className="p-1.5 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
            aria-label="Mois précédent"
            tabIndex="0"
          >
            <FiChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          
          <button
            onClick={handleNextMonth}
            onKeyDown={(e) => handleKeyDown(e, handleNextMonth)}
            className="p-1.5 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
            aria-label="Mois suivant"
            tabIndex="0"
          >
            <FiChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Jours de la semaine - Header */}
      <div 
        className="grid grid-cols-7 gap-1 mb-2"
        role="row"
        aria-label="Jours de la semaine"
      >
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
          <div 
            key={i}
            className="text-center text-xs font-semibold text-gray-500 py-1"
            role="columnheader"
            aria-label={['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][i]}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div 
        className="grid grid-cols-7 gap-1"
        role="grid"
        aria-labelledby="small-calendar-title"
      >
        {/* Première ligne - Jours du mois précédent si nécessaire */}
        {currentMonth[0].map((day, i) => {
          const isPrevMonth = day.month() !== currentMonthIdx;
          return (
            <div 
              key={`prev-${i}`}
              className={`text-center py-1.5 text-sm ${isPrevMonth ? 'text-gray-300' : 'hidden'}`}
              aria-hidden="true"
            >
              {day.format("D")}
            </div>
          );
        })}
        
        {/* Jours du mois actuel */}
        {currentMonth.flat().map((day, idx) => {
          const isCurrentMonth = day.month() === currentMonthIdx;
          if (!isCurrentMonth) return null;
          
          const isWeekend = day.day() === 0 || day.day() === 6;
          
          return (
            <button
              key={idx}
              onClick={() => {
                setSmallCalendarMonth(currentMonthIdx);
                setDaySelected(day);
              }}
              onKeyDown={(e) => handleKeyDown(e, () => {
                setSmallCalendarMonth(currentMonthIdx);
                setDaySelected(day);
              })}
              className={`
                w-8 h-8 flex items-center justify-center text-sm rounded-lg
                transition-all duration-150 transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
                ${getDayClass(day)} ${isWeekend ? 'font-medium' : ''}
              `}
              aria-label={`${day.format("dddd DD MMMM YYYY")}, ${isWeekend ? 'week-end' : 'jour de semaine'}`}
              aria-pressed={daySelected && daySelected.format("DD-MM-YY") === day.format("DD-MM-YY")}
              tabIndex="0"
            >
              <span className={isWeekend && !getDayClass(day).includes('indigo') ? "text-red-500" : ""}>
                {day.format("D")}
              </span>
              
              {/* Indicateur pour aujourd'hui */}
              {day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") && (
                <div 
                  className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white"
                  aria-label="Aujourd'hui"
                  title="Aujourd'hui"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Légende et informations */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
            <span>Aujourd'hui</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-100 rounded-full ring-1 ring-indigo-300" />
            <span>Sélectionné</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-100 rounded-full" />
            <span>Week-end</span>
          </div>
        </div>
        
        {/* Bouton rapide pour revenir à aujourd'hui */}
        <button
          onClick={() => {
            setDaySelected(dayjs());
            setCurrentMonthIdx(dayjs().month());
          }}
          onKeyDown={(e) => handleKeyDown(e, () => {
            setDaySelected(dayjs());
            setCurrentMonthIdx(dayjs().month());
          })}
          className="w-full mt-3 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          aria-label="Revenir à aujourd'hui"
          tabIndex="0"
        >
          Retour à aujourd'hui
        </button>
      </div>
    </div>
  );
}