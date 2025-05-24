// Entry Point - EventCalendar.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import CalendarDay from './CalendarDay';
import EventForm from './EventForm';
import { generateRecurringEvents } from '../hooks/useCalendarEvents';
import { EVENT_CATEGORIES } from '../utils/constants';
import { formatDate, isSameDay, getDaysInMonth, getFirstDayOfMonth } from '../utils/dateUtils';
import { loadEventsFromStorage, saveEventsToStorage } from '../utils/storageUtils';

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 24));
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const storedEvents = loadEventsFromStorage();
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    saveEventsToStorage(events);
  }, [events]);

  const allEvents = useMemo(() => {
    return events.flatMap(event => generateRecurringEvents(event));
  }, [events]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allEvents, searchTerm, filterCategory]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date(2025, 4, 24);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const days = [];

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({ date: new Date(prevYear, prevMonth, daysInPrevMonth - i), isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true, isToday: isSameDay(date, today) });
    }

    const remainingDays = 42 - days.length;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(nextYear, nextMonth, day), isCurrentMonth: false });
    }

    return days;
  }, [year, month, today]);

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEventSave = (eventData) => {
    if (editingEvent) {
      setEvents(events.map(event => event.id === editingEvent.id ? eventData : event));
    } else {
      const newEvent = {
        ...eventData,
        date: selectedDate ? formatDate(selectedDate) : eventData.date
      };
      setEvents([...events, newEvent]);
    }
    setShowEventForm(false);
    setEditingEvent(null);
    setSelectedDate(null);
  };

  const handleEventEdit = (event) => {
    const originalEvent = event.isRecurring ? events.find(e => e.id === event.originalId) : event;
    setEditingEvent(originalEvent || event);
    setShowEventForm(true);
  };

  const handleEventDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(event => event.id !== eventId));
    }
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleEventDrop = (eventId, newDate) => {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    if (event.isRecurring) {
      const newEvent = { ...event, id: Date.now().toString(), date: newDate, isRecurring: false };
      setEvents([...events, newEvent]);
    } else {
      setEvents(events.map(e => e.id === eventId ? { ...e, date: newDate } : e));
    }
  };

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-800">Event Calendar</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
                />
              </div>
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setSelectedDate(new Date(2025, 4, 24));
                  setEditingEvent(null);
                  setShowEventForm(true);
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-orange-500 text-white p-4">
            <div className="flex items-center justify-between">
              <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-orange-600 rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold">{monthNames[month]} {year}</h2>
              <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-orange-600 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 bg-gray-100">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map(({ date, isCurrentMonth, isToday }, index) => (
              <CalendarDay
                key={index}
                date={date}
                events={filteredEvents}
                isCurrentMonth={isCurrentMonth}
                isToday={isToday}
                onClick={handleDayClick}
                onEventEdit={handleEventEdit}
                onEventDelete={handleEventDelete}
                onDrop={handleEventDrop}
              />
            ))}
          </div>
        </div>
      </div>

      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSave={handleEventSave}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
            setSelectedDate(null);
          }}
          onDelete={handleEventDelete}
        />
      )}
    </div>
  );
};

export default EventCalendar;
