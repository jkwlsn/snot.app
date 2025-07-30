export function usePollenSensitivity(min = 1, max = 10) {
  function clamp(value) {
    return Math.min(Math.max(value, min), max);
  }
  return { clamp, min, max };
}
