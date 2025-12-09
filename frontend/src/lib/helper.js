export const formatLocalDateTime = (dateString) => {
  const d = new Date(dateString);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 16);
};
