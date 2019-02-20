const DEFAULT_AIM_SPEED = 100;
import { EASE_IN_OUT } from "src/constants/easing";

Crafty.c("Aimable", {
  init() {
    this.aim = this.aim.bind(this);
    this.resetAim = this.resetAim.bind(this);
  },

  async aim({ target, speed = DEFAULT_AIM_SPEED, easing = EASE_IN_OUT }) {
    const tweens = [];
    const aimingParts = this.aimParts || [];
    this.forEachPart((item, index) => {
      const options = this.spriteOptions(index);
      if (aimingParts.includes(options.key)) {
        const parent = item._parent;
        const aimCoord = [parent.x + options.ro[0], parent.y + options.ro[1]];

        const targetCoord = [target.x + target.w / 2, target.y + target.h / 2];

        const dx = aimCoord[0] - targetCoord[0];
        const dy = aimCoord[1] - targetCoord[1];

        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        item.addComponent("TweenPromise");
        const angleDelta = Math.abs(item.rotation - angle);

        const duration = 1000 / speed * angleDelta;
        tweens.push(item.tweenPromise({ rotation: angle }, duration, easing));
      }
    });
    await Promise.all(tweens);
  },

  async resetAim({ speed = DEFAULT_AIM_SPEED, easing = EASE_IN_OUT } = {}) {
    const tweens = [];
    const aimingParts = this.aimParts || [];
    this.forEachPart((item, index) => {
      const options = this.spriteOptions(index);
      if (aimingParts.includes(options.key)) {
        item.addComponent("TweenPromise");
        const angleDelta = Math.abs(item.rotation);

        const duration = 1000 / speed * angleDelta;
        tweens.push(item.tweenPromise({ rotation: 0 }, duration, easing));
      }
    });
    await Promise.all(tweens);
  }
});
