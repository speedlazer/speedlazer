export const EASE_IN_OUT = "easeInOutQuad";
export const EASE_IN = "easeInQuad";
export const EASE_OUT = "easeOutQuad";
export const LINEAR = "linear";

export const easingFunctions = {
  // no easing, no acceleration
  linear: t => t,
  // smooth step; starts and ends with v=0
  smoothStep: t => (3 - 2 * t) * t * t,
  // smootherstep; starts and ends with v, a=0
  smootherStep: t => (6 * t * t - 15 * t + 10) * t * t * t,

  // quadratic curve; starts with v=0
  easeInQuad: t => t * t,
  // quadratic curve; ends with v=0
  easeOutQuad: t => t * (2 - t),
  // quadratic curve; starts and ends with v=0
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1)
};
