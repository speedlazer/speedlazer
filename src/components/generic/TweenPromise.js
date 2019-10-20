import Animator from "./Animator";

export const tweenFn = (entity, next, current = undefined) => {
  const c = current ? current : entity;
  return Object.entries(next).reduce(
    (acc, [key, newValue]) => {
      const t0 = c[key];
      return t => {
        acc(t);
        entity[key] = (1 - t) * t0 + t * newValue;
      };
    },
    () => {}
  );
};

const TweenPromise = "TweenPromise";
Crafty.c(TweenPromise, {
  required: Animator,

  async tweenPromise(props, duration, easing) {
    const tweenFunc = tweenFn(this, props);
    return this.animate(tweenFunc, duration, easing);
  }
});

export default TweenPromise;
