import { formatDate } from '../utils/dateUtils';

export const generateRecurringEvents = (event, endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)) => {
  if (event.recurrence === 'none') return [event];

  const events = [event];
  const currentDate = new Date(event.date);

  while (currentDate <= endDate) {
    switch (event.recurrence) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1); break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7); break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1); break;
      case 'custom':
        currentDate.setDate(currentDate.getDate() + (event.customInterval || 1)); break;
    }

    if (currentDate <= endDate) {
      events.push({
        ...event,
        id: `${event.id}_${formatDate(currentDate)}`,
        date: formatDate(currentDate),
        isRecurring: true,
        originalId: event.id
      });
    }
  }

  return events;
};
