import { ALERT_LIMIT_BASE } from './../config';

export function calculateLimit(sensitivity) {
  return sensitivity > 0
    ? Math.round(ALERT_LIMIT_BASE / sensitivity)
    : Infinity;
}
