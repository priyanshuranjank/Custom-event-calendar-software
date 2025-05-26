export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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