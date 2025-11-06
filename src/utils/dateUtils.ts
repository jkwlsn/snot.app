import { format, parseISO, isValid } from "date-fns";
import { UTCDate } from "@date-fns/utc";

export const createUTCDate = (): Date => {
  return new UTCDate();
};

export const formatDateToLocaleString = (
  date: Date,
  options?: Intl.DateTimeFormatOptions,
): string => {
  return new Intl.DateTimeFormat(undefined, options).format(date);
};

// Format dates for HTML input elements (no milliseconds or timezone)
export const formatDateForInput = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

// This function should always return a Date, so if it's invalid, return an invalid Date.
export const parseDateFromInput = (dateString: string): Date => {
  const parsedDate = parseISO(dateString);
  return isValid(parsedDate) ? new UTCDate(parsedDate) : new Date(NaN);
};

