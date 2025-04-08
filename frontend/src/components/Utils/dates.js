export const formatDate = (isoString, type) => {
  try {
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
  } catch (e) {
    return "";
  }
};

export const getStrTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let result = [];

  if (hours > 0) {
    result.push(`${hours} ${getWordForm(hours, ["час", "часа", "часов"])}`);
  }

  if (minutes > 0 || (hours === 0 && minutes === 0)) {
    result.push(
      `${minutes} ${getWordForm(minutes, ["минута", "минуты", "минут"])}`
    );
  }

  return result.join(" ");
};
export const getWordForm = (n, forms) => {
  const absN = Math.abs(n) % 100;
  const n1 = absN % 10;
  if (absN > 10 && absN < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
};
