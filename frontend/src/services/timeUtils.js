/**
 * Converts 24-hour time string (e.g. "13:00") to 12-hour AM/PM format (e.g. "1:00 PM")
 * @param {string} time24 
 * @returns {string}
 */
export const formatTo12Hour = (time24) => {
  if (!time24) return "";
  
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours, 10);
  const m = minutes;
  const ampm = h >= 12 ? 'PM' : 'AM';
  
  h = h % 12;
  h = h ? h : 12; // the hour '0' should be '12'
  
  return `${h}:${m} ${ampm}`;
};
