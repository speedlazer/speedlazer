const TweenPromise = "TweenPromise";

Crafty.c(TweenPromise, {
  init() {
    this.requires("Tween");
  },

  tweenPromise(props, duration, easing) {
    return new Promise(resolve => {
      if (duration > 0) {
        this.one("TweenEnd", () => resolve(this));
        this.tween(props, duration, easing);
      } else {
        this.attr(props);
        resolve();
      }
    });
  }
});

export default TweenPromise;
