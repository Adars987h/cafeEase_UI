import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const MyCalendar = ({ showCalendars, onDateChange }) => {
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);

  React.useEffect(() => {
    onDateChange(
      startDate ? formatDateTime(startDate) : null,
      endDate ? formatDateTime(endDate) : null
    );
  }, [startDate, endDate, onDateChange]);

  const formatDateTime = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  if (!showCalendars) return null;

  return (
    <div className="calendars">
      <div className="calendar-section">
        <span className="filter-rail-heading">Start date</span>
        <Calendar onChange={setStartDate} value={startDate} />
        <button className="text-button" onClick={() => setStartDate(null)}>Clear start date</button>
      </div>
      <div className="calendar-section">
        <span className="filter-rail-heading">End date</span>
        <Calendar onChange={setEndDate} value={endDate} />
        <button className="text-button" onClick={() => setEndDate(null)}>Clear end date</button>
      </div>
    </div>
  );
};

export default MyCalendar;
