export const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (date) => {
  return date.toTimeString().slice(0, 5);
};

export const parseDateTime = (dateStr, timeStr) => {
  return new Date(`${dateStr}T${timeStr}`);
};

export const isSameDay = (date1, date2) => {
  return formatDate(date1) === formatDate(date2);
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};