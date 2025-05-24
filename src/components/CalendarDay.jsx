import React from 'react';
import EventItem from './EventItem';
import { isSameDay, formatDate } from '../utils/dateUtils';

const CalendarDay = ({
  date,
  events,
  isCurrentMonth,
  isToday,
  onClick,
  onEventEdit,
  onEventDelete,
  onDrop
}) => {
  const dayEvents = events.filter(event => isSameDay(new Date(event.date), date));

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    onDrop(eventId, formatDate(date));
  };

  return (
    <div
      className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-orange-50 transition-colors ${
        !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
      } ${isToday ? 'ring-2 ring-orange-500' : ''}`}
      onClick={() => onClick(date)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`text-sm font-medium mb-2 ${isToday ? 'text-orange-600' : ''}`}>
        {date.getDate()}
      </div>
      <div className="space-y-1">
        {dayEvents.slice(0, 3).map((event) => (
          <EventItem
            key={event.id}
            event={event}
            onEdit={() => onEventEdit(event)}
            onDelete={() => onEventDelete(event.id)}
          />
        ))}
        {dayEvents.length > 3 && (
          <div className="text-xs text-gray-500 text-center">
            +{dayEvents.length - 3} more
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
