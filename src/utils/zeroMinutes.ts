export function zeroMinutes(date: Date): Date {
  const newDate = new Date(date);
  newDate.setMinutes(0);
  return newDate;
}
