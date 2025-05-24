const STORAGE_KEY = 'calendar_events';

export const loadEventsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

export const saveEventsToStorage = (events) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving events:', error);
  }
};