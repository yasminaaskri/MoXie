import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "./context/GlobalContext";
import EventModal from "./components/EventModal"; // Updated import
import CalendarHeader from "./components/CalendarHeader";
import Sidebar from "./components/Sidebar";
import Month from "./components/Month";
import Meeting from "./meeting/Meeting";
import { getMonth } from "./util";


export default function UserCalendar() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal, activeMeeting } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  if (activeMeeting) {
    return <Meeting roomName={activeMeeting} />;
  }

  return (
    <React.Fragment>
      {showEventModal && <EventModal />}

      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          <Month month={currentMonth} />
        </div>
      </div>
    </React.Fragment>
  );
}
