import Animator from "./Animator";

const TweenPromise = "TweenPromise";

Crafty.c(TweenPromise, {
  required: Animator,

  tweenFn(props) {
    return Object.entries(props).reduce(
      (acc, [key, newValue]) => {
        const t0 = this[key];
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
