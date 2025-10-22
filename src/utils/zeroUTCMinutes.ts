export function zeroUTCMinutes(date: Date): Date {
  const newDate = new Date(date);
  newDate.setUTCMinutes(0);
  return newDate;
}
