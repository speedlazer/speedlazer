const Animator = "Animator";

Crafty.c(Animator, {
  init() {
    this.animations = [];
  },

  animate(transitionFn, duration, easing = "linear") {
    if (!transitionFn) {
      return Promise.resolve();
    }
    if (duration === 0) {
      transitionFn(1);
      return Promise.resolve();
    }

    return new Promise(resolve => {
      const animation = {
        transition: transitionFn,
        timer: new Crafty.easing(duration, easing),
        resolver: resolve
      };
      this.animations.push(animation);
      if (!this.animating) {
        this.animating = true;
        this.uniqueBind("UpdateFrame", this._animateTick);
      }
    });
  },

  _animateTick({ dt }) {
    const toRemove = [];
    this.animations.forEach((animation, i) => {
      const { timer, transition, resolver } = animation;
      timer.tick(dt);
      transition(timer.value());
      if (timer.complete) {
        toRemove.push(i);
        resolver();
      }
    });
    toRemove.reverse().forEach(i => this.animations.splice(i, 1));

    if (this.animations.length === 0) {
      this.animating = false;
      this.unbind("UpdateFrame", this._animateTick);
    }
  }
});

export default Animator;
