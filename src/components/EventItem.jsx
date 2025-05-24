import React from 'react';
import { Edit } from 'lucide-react';
import { parseDateTime, formatTime } from '../utils/dateUtils';
import { EVENT_CATEGORIES } from '../utils/constants';

const EventItem = ({ event, onEdit, onDelete }) => {
  const category = EVENT_CATEGORIES[event.category];
  const eventDateTime = parseDateTime(event.date, event.time);

  return (
    <div
      className="p-2 mb-1 rounded text-xs cursor-pointer group hover:shadow-md transition-shadow"
      style={{ backgroundColor: category.color, color: 'white' }}
      onClick={onEdit}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', event.id);
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{event.title}</div>
          <div className="opacity-90">{formatTime(eventDateTime)}</div>
          {event.isRecurring && (
            <div className="opacity-75 text-xs">🔄 Recurring</div>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
          >
            <Edit className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
