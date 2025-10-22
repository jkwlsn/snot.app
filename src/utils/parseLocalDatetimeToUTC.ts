export function parseLocalDatetimeToUTC(datetimeLocalString: string): Date {
  if (!datetimeLocalString) {
    return new Date();
  }

  const [datePart, timePart] = datetimeLocalString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  const localDate = new Date(year, month - 1, day, hours, minutes);

  return localDate;
}
