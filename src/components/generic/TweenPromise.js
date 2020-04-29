import Animator from "./Animator";

export const tweenFn = (entity, next, current = undefined) => {
  const c = current ? current : entity;
  const transitions = Object.entries(next).reduce(
    (acc, [key, newValue]) =>
      Object.prototype.hasOwnProperty.call(c, key) && c[key] !== newValue
        ? acc.concat({ key, current: c[key], newValue })
        : acc,
    []
  );
  if (transitions.length == 0) {
    return false;
  }

  return t => {
    transitions.forEach(({ key, current, newValue }) => {
      if (key === "overrideColor") {
        entity[key] = {
          _red: (1 - t) * current._red + t * newValue._red,
          _green: (1 - t) * current._green + t * newValue._green,
          _blue: (1 - t) * current._blue + t * newValue._blue
        };
      } else {
        entity[key] = (1 - t) * current + t * newValue;
      }
    });
  };
};

export const TweenPromise = "TweenPromise";
Crafty.c(TweenPromise, {
  required: Animator,

  async tweenPromise(props, duration, easing) {
    const tweenFunc = tweenFn(this, props);
    return this.animate(tweenFunc, duration, easing);
  }
});

export default TweenPromise;
