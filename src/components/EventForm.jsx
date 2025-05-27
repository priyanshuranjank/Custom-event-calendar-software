import React, { useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { EVENT_CATEGORIES, RECURRENCE_OPTIONS } from '../utils/constants';

const EventForm = ({ event, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: event?.date || formatDate(new Date()),
    time: event?.time || '09:00',
    description: event?.description || '',
    category: event?.category || 'work',
    recurrence: event?.recurrence || 'none',
    customInterval: event?.customInterval || 1
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Enter an event title');
      return;
    }
    onSave({
      ...event,
      ...formData,
      id: event?.id || Date.now().toString()
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {event ? 'Edit Event' : 'Add Event'}
            </h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

                          {/* Form Inputs */}
          <div className="space-y-4">
            <input
              type="text"
              required
              placeholder="Event Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
            />

            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
            >
              {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>{cat.label}</option>
              ))}
            </select>

            <select
              value={formData.recurrence}
              onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
            >
              {RECURRENCE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {formData.recurrence === 'custom' && (
              <input
                type="number"
                min="1"
                value={formData.customInterval}
                onChange={(e) => setFormData({ ...formData, customInterval: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
              />
            )}

                                  {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 flex items-center gap-2 justify-center"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              {event && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
