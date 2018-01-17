Crafty.c("TweenPromise", {
  init() {
    this.requires("Tween");
  },

  tweenPromise(...args) {
    return new Promise(resolve => {
      this.one("TweenEnd", () => resolve(this));
      this.tween(...args);
    });
  }
});
