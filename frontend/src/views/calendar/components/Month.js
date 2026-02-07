// Month.js - Design UI/UX Expert
import React from "react";
import Day from "./Day";
import { FiCalendar, FiUsers, FiClock, FiTrendingUp } from "react-icons/fi";

export default function Month({ month }) {
  // Calcul des statistiques du mois
  const totalDays = month.flat().length;
  const today = new Date();
  const currentDay = today.getDate();
  const daysPassed = Math.min(currentDay, totalDays);
  const progress = (daysPassed / totalDays) * 100;

  return (
    <div className="flex-1 p-4">
      {/* Header élégant des jours de la semaine */}
      <div 
        className="grid grid-cols-7 gap-1 mb-3 bg-white rounded-xl shadow-sm p-3"
        role="row"
        aria-label="Week days"
      >
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => {
          const isWeekend = i === 0 || i === 6;
          
          return (
            <div 
              key={i}
              className="text-center"
              role="columnheader"
              aria-label={['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]}
            >
              <span className={`
                font-bold text-sm
                ${isWeekend ? 'text-red-600' : 'text-gray-700'}
              `}>
                {day}
              </span>
              
              {/* Indicateur subtil pour week-end */}
              {isWeekend && (
                <div className="mt-1 w-6 h-1 mx-auto bg-gradient-to-r from-red-400 to-pink-400 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grille principale compacte */}
      <div 
  className="grid grid-cols-7 gap-1 mb-6 min-h-[800px]"
  role="grid"
  aria-label="Month calendar grid"
>
        {month.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <div key={idx} className="min-h-[180px] h-full">
                <Day 
                  day={day} 
                  rowIdx={i} 
                  aria-label={`Day ${day.format('DD MMMM YYYY')}`}
                />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Dashboard créatif - Statistiques du mois */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm border border-blue-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <FiCalendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Monthly Overview</h3>
              <p className="text-sm text-gray-600">Stay on track with your schedule</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{daysPassed}/{totalDays}</div>
            <div className="text-xs text-gray-500">Days passed</div>
          </div>
        </div>

        {/* Barre de progression visuelle */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Month Progress</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Métriques rapides */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FiUsers className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-gray-700">Meetings</span>
            </div>
            <div className="text-lg font-bold text-gray-800">12</div>
            <div className="text-xs text-green-600">↑ 3 this week</div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FiClock className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold text-gray-700">Hours</span>
            </div>
            <div className="text-lg font-bold text-gray-800">48h</div>
            <div className="text-xs text-orange-600">Total scheduled</div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FiTrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-gray-700">Productivity</span>
            </div>
            <div className="text-lg font-bold text-gray-800">78%</div>
            <div className="text-xs text-purple-600">Meeting success rate</div>
          </div>
        </div>

        {/* Indicateur de densité */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Day density indicator:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div 
                  key={level}
                  className={`w-6 h-1 rounded ${
                    level <= 3 
                      ? 'bg-green-400' 
                      : level === 4 
                      ? 'bg-yellow-400' 
                      : 'bg-red-400'
                  }`}
                  title={`${level}/5 busyness level`}
                />
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex justify-between">
            <span>Light</span>
            <span>Moderate</span>
            <span>Busy</span>
          </div>
        </div>
      </div>

      {/* Légende rapide */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">Weekend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">Meeting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">Task</span>
        </div>
      </div>
    </div>
  );
}