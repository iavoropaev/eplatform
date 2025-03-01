export const formatDate = (isoString, type) => {
  const date = new Date(isoString);
  if (type === "short") {
    return new Intl.DateTimeFormat("ru-RU", {
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    }).format(date);
  }
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
