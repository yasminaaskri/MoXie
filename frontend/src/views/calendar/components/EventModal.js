// EventModal.js - Modal amélioré avec accessibilité
import React, { useContext, useState, useEffect, useRef } from "react";
import GlobalContext from "../context/GlobalContext";
import { createEvent, updateEvent, deleteEvent } from "../service/ApiEvents";
import {
  FiX, FiCalendar, FiClock, FiFileText, FiLink,
  FiUsers, FiVideo, FiBell, FiUpload, FiEye
} from "react-icons/fi";
import { FaUniversalAccess, FaWheelchair } from "react-icons/fa";

const labelsClasses = [
  { id: "purple", name: "Réunion", color: "bg-purple-500", text: "text-purple-800" },
  { id: "blue", name: "Tâche", color: "bg-blue-500", text: "text-blue-800" },
  { id: "green", name: "Formation", color: "bg-green-500", text: "text-green-800" },
  { id: "red", name: "Urgent", color: "bg-red-500", text: "text-red-800" },
  { id: "indigo", name: "Projet", color: "bg-indigo-500", text: "text-indigo-800" },
  { id: "gray", name: "Divers", color: "bg-gray-500", text: "text-gray-800" },
];

export default function EventModal() {
  const {
    setShowEventModal,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
  } = useContext(GlobalContext);

  const [title, setTitle] = useState(selectedEvent ? selectedEvent.title : "");
  const [description, setDescription] = useState(selectedEvent ? selectedEvent.description : "");
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent ? selectedEvent.label : "purple"
  );
  const [startTime, setStartTime] = useState(selectedEvent ? selectedEvent.startTime : "09:00");
  const [endTime, setEndTime] = useState(selectedEvent ? selectedEvent.endTime : "10:00");
  const [meetingUrl, setMeetingUrl] = useState(selectedEvent ? selectedEvent.meetingUrl : "");
  const [participants, setParticipants] = useState(selectedEvent ? selectedEvent.participants || "" : "");
  const [accessibilityNotes, setAccessibilityNotes] = useState(selectedEvent ? selectedEvent.accessibilityNotes || "" : "");
  const [reminder, setReminder] = useState(selectedEvent ? selectedEvent.reminder || "15" : "15");
  
  const modalRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description);
      setSelectedLabel(selectedEvent.label);
      setStartTime(selectedEvent.startTime);
      setEndTime(selectedEvent.endTime);
      setMeetingUrl(selectedEvent.meetingUrl || "");
      setParticipants(selectedEvent.participants || "");
      setAccessibilityNotes(selectedEvent.accessibilityNotes || "");
      setReminder(selectedEvent.reminder || "15");
    }
    
    // Focus sur le titre à l'ouverture
    if (titleRef.current) {
      titleRef.current.focus();
    }
    
    // Gérer la fermeture avec Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowEventModal(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedEvent, setShowEventModal]);

  async function handleSubmit(e) {
    e.preventDefault();
    
    const calendarEvent = {
      title,
      description,
      label: selectedLabel,
      day: daySelected.valueOf(),
      startTime,
      endTime,
      meetingUrl,
      participants,
      accessibilityNotes,
      reminder,
      createdAt: new Date().toISOString(),
    };

    try {
      if (selectedEvent) {
        const response = await updateEvent(selectedEvent._id, calendarEvent);
        dispatchCalEvent({ type: "update", payload: response.data });
      } else {
        const response = await createEvent(calendarEvent);
        dispatchCalEvent({ type: "push", payload: response.data });
      }
      setShowEventModal(false);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Échec de l'enregistrement. Veuillez réessayer.");
    }
  }

  async function handleDelete() {
    if (selectedEvent && window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        await deleteEvent(selectedEvent._id);
        dispatchCalEvent({ type: "delete", payload: selectedEvent });
        setShowEventModal(false);
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Échec de la suppression. Veuillez réessayer.");
      }
    }
  }

  // Accessibilité : fermer modal en cliquant en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowEventModal(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowEventModal]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* En-tête */}
        <header className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCalendar className="w-6 h-6" />
              <h2 id="modal-title" className="text-xl font-bold">
                {selectedEvent ? "Modifier la réunion" : "Nouvelle réunion"}
              </h2>
            </div>
            <button
              onClick={() => setShowEventModal(false)}
              className="p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Fermer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Indicateur d'accessibilité */}
          <div className="flex items-center gap-2 mt-2 text-sm bg-white/20 rounded-lg p-2">
            <FaUniversalAccess className="w-4 h-4" />
            <span>Formulaire accessible - Compatible lecteur d'écran</span>
          </div>
        </header>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FiFileText /> Titre de la réunion *
            </label>
            <input
              ref={titleRef}
              id="title"
              type="text"
              value={title}
              required
              placeholder="Ex: Réunion projet TILI"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={(e) => setTitle(e.target.value)}
              aria-required="true"
            />
          </div>

          {/* Date et heure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiCalendar /> Date
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {daySelected.format("dddd DD MMMM YYYY")}
              </div>
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiClock /> Heure
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setStartTime(e.target.value)}
                  aria-label="Heure de début"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="time"
                  value={endTime}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setEndTime(e.target.value)}
                  aria-label="Heure de fin"
                />
              </div>
            </div>
          </div>

          {/* Participants */}
          <div>
            <label htmlFor="participants" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FiUsers /> Participants
            </label>
            <input
              id="participants"
              type="text"
              value={participants}
              placeholder="Noms des participants, séparés par des virgules"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setParticipants(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FiFileText /> Description
            </label>
            <textarea
              id="description"
              value={description}
              placeholder="Ordre du jour, points à discuter..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Accessibilité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 font-semibold mb-3">
              <FaWheelchair className="w-5 h-5" />
              Accessibilité
            </div>
            <label htmlFor="accessibility" className="block text-sm text-gray-700 mb-2">
              Notes d'accessibilité (sous-titres, accès, besoins spécifiques)
            </label>
            <textarea
              id="accessibility"
              value={accessibilityNotes}
              placeholder="Ex: Prévoir sous-titrage, salle accessible PMR, documents en braille..."
              rows="2"
              className="w-full p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              onChange={(e) => setAccessibilityNotes(e.target.value)}
            />
          </div>

          {/* Lien de réunion */}
          <div>
            <label htmlFor="meetingUrl" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FiLink /> Lien de visioconférence (optionnel)
            </label>
            <input
              id="meetingUrl"
              type="url"
              value={meetingUrl}
              placeholder="https://meet.jit.si/..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setMeetingUrl(e.target.value)}
            />
          </div>

          {/* Rappel */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FiBell /> Rappel avant la réunion
            </label>
            <select
              value={reminder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setReminder(e.target.value)}
              aria-label="Délai de rappel"
            >
              <option value="5">5 minutes avant</option>
              <option value="15">15 minutes avant</option>
              <option value="30">30 minutes avant</option>
              <option value="60">1 heure avant</option>
              <option value="1440">1 jour avant</option>
              <option value="0">Pas de rappel</option>
            </select>
          </div>

          {/* Labels (couleurs) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Type et couleur
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {labelsClasses.map((label) => (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => setSelectedLabel(label.id)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border-2
                    ${selectedLabel === label.id ? 'border-indigo-500' : 'border-gray-200'}
                    hover:border-gray-300 transition-colors
                  `}
                  aria-label={`Type : ${label.name}`}
                >
                  <div className={`w-6 h-6 ${label.color} rounded-full mb-2`} />
                  <span className="text-xs font-medium text-gray-700">{label.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            {selectedEvent && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-3 bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 flex-1"
              >
                Supprimer
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowEventModal(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
            >
              {selectedEvent ? "Modifier" : "Créer la réunion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}