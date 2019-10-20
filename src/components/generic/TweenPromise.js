import Animator from "./Animator";

const TweenPromise = "TweenPromise";

Crafty.c(TweenPromise, {
  required: Animator,

  tweenFn(next, current = undefined) {
    const c = current ? current : this;
    return Object.entries(next).reduce(
      (acc, [key, newValue]) => {
        const t0 = c[key];
        return t => {
          acc(t);
          this[key] = (1 - t) * t0 + t * newValue;
        };
      },

      () => {}
    );
  },

  async tweenPromise(props, duration, easing) {
    const tweenFunc = this.tweenFn(props);
    return this.animate(tweenFunc, duration, easing);
  }
});

export default TweenPromise;
