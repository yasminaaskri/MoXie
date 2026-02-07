import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";
import { getAllEvents } from "../service/ApiEvents";

function savedEventsReducer(state, { type, payload }) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      console.table(payload);
      return state.map((evt) => (evt._id === payload._id ? payload : evt));
    case "delete":
      return state.filter((evt) => evt._id !== payload._id);
    case "load":
      return payload;
    default:
      throw new Error();
  }
}

// function savedEventsReducer(state, { type, payload }) {
//   switch (type) {
//     case "push":
//       return [...state, payload];
//     case "update":
//       return state.map((evt) =>
//         evt.id === payload.id ? payload : evt
//       );
//     case "delete":
//       return state.filter((evt) => evt.id !== payload.id);
//     default:
//       throw new Error();
//   }
// }

export default function ContextWrapper(props) {
  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [labels, setLabels] = useState([]);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    []
  );

  const [authUser, setAuthUser] = useState(null);

  // Load events from API on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await getAllEvents();
        dispatchCalEvent({ type: "load", payload: response.data });
      } catch (error) {
        console.error("Error loading events:", error);
        // Fallback to localStorage if API fails
        const storageEvents = localStorage.getItem("savedEvents");
        const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
        dispatchCalEvent({ type: "load", payload: parsedEvents });
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt) =>
      labels
        .filter((lbl) => lbl.checked)
        .map((lbl) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  // Save to localStorage as backup
  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map(
        (label) => {
          const currentLabel = prevLabels.find(
            (lbl) => lbl.label === label
          );
          return {
            label,
            checked: currentLabel ? currentLabel.checked : true,
          };
        }
      );
    });
  }, [savedEvents]);

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);
  useEffect(() => {
    console.log("Selected Event in ContextWrapper:", selectedEvent);
  }, [selectedEvent]);
  
  function updateLabel(label) {
    setLabels(
      labels.map((lbl) => (lbl.label === label.label ? label : lbl))
    );
  }

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
        authUser, // Replaced currentUser with authUser
        setAuthUser, // Replaced setCurrentUser with setAuthUser
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
