/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const defaults = require('lodash/defaults');
const clone = require('lodash/clone');
const extend = require('lodash/extend');

// TODO: Document
//
// I need to rethinkt the intentions of this component.
// It was setup as a sort of tweening chain, but promises in lazerscript work better
//
// The chaining is currently used in 1 part: The intro animation.
// So, step 1: Check if the intro animation can be done differently.
//
// 1. Synching of animation with other entities
//
// The intro animation uses the following:
// - linear (chained)
// - delay (chained)
//
// So, we could potentially remove the following:
//
// - viewport
// - viewportBezier
//
// The rest of the app uses the following: (entity script)
// - viewport (non-chained)
//
//
//
Crafty.c('Choreography', {
  init() {
    return this._ctypes = {
      delay: this._executeDelay,
      linear: this._executeLinear,
      viewport: this._executeMoveIntoViewport
    };
  },

  remove() {
    this.unbind('GameLoop', this._choreographyTick);
    if (this._currentPart == null) { return; }
    this._currentPart = null;
    this._choreography = [];
    return this.trigger('ChoreographyEnd');
  },

  choreography(c, options) {
    if (options == null) { options = {}; }
    this.uniqueBind('GameLoop', this._choreographyTick);
    this._options = defaults(options, {
      repeat: 0,
      skip: 0
    });

    this._choreography = c;
    this._repeated = 0;
    let part = 0;
    this._setupCPart(part);
    let toSkip = options.skip;
    this._toSkip = 0;
    if (toSkip > 0) {
      while ((part < (this._choreography.length - 1)) && (toSkip > this._currentPart.duration)) {
        toSkip -= this._currentPart.duration;
        part += 1;
        this._setupCPart(part);
      }
      this._toSkip = toSkip;
    }
    return this;
  },

  synchChoreography(otherComponent) {
    this._choreography = clone(otherComponent._choreography);
    this._options = otherComponent._options;
    this._repeated = otherComponent._repeated;
    this._toSkip = otherComponent._toSkip;
    this._currentPart = clone(otherComponent._currentPart);
    this._currentPart.easing = clone(otherComponent._currentPart.easing);
    return this.uniqueBind('GameLoop', this._choreographyTick);
  },

  _setupCPart(number) {
    this._currentPart = null;
    if (!(number < this._choreography.length)) {
      if ((this._repeated < this._options.repeat) || (this._options.repeats === -1)) {
        this._repeated += 1;
        number = 0;
      } else {
        if (this.updateMovementVisuals != null) {
          this.updateMovementVisuals(undefined, 0, 0, 1);
        }
        this._choreography = [];
        this.unbind('GameLoop', this._choreographyTick);
        this.trigger('ChoreographyEnd');
        this._px = this.x;
        this._py = this.y;
        return;
      }
    }

    const part = this._choreography[number];
    if (part.event != null) {
      this.trigger(part.event, { entity: this, data: part.data });
    }
    return this._setupPart(part, number);
  },

  choreographyDelta() {
    return {
      x: this.x - this._px,
      y: this.y - this._py
    };
  },

  _choreographyTick(frameData) {
    this._px = this.x;
    this._py = this.y;
    if (this._currentPart == null) { return; }
    const prevv = this._currentPart.easing.value();
    const dt = frameData.dt + this._toSkip;
    this._currentPart.easing.tick(dt);
    this._toSkip = 0;
    const v = this._currentPart.easing.value();
    this._ctypes[this._currentPart.type].apply(this, [v, prevv, dt]);

    if (this._currentPart.easing.complete) {
      return this._setupCPart(this._currentPart.part + 1);
    }
  },

  _setupPart(part, number) {
    const easingFn = part.easingFn != null ? part.easingFn : 'linear';
    this._currentPart = extend(clone(part), {
      part: number,
      x: this.x,
      y: this.y,
      dx: part.x,
      dy: part.y,
      rotation: part.rotation,
      easing: new Crafty.easing(part.duration != null ? part.duration : 0, easingFn)
    }
    );
    if (part.properties) {
      const currentProperties = {};
      for (let k in part.properties) {
        currentProperties[k] = this[k];
      }
      return this._currentPart.currentProperties = currentProperties;
    }
  },

  _executeLinear(v, prevv) {
    const dx = (v * (this._currentPart.dx != null ? this._currentPart.dx : 0)) - (prevv * (this._currentPart.dx != null ? this._currentPart.dx : 0));
    const dy = (v * (this._currentPart.dy != null ? this._currentPart.dy : 0)) - (prevv * (this._currentPart.dy != null ? this._currentPart.dy : 0));
    return this.shift(dx, dy);
  },

  _executeDelay(v) {},

  _executeMoveIntoViewport(v, prevv, dt) {
    // the goal are current coordinates on screen
    const destinationX = this._currentPart.dx;
    let dx = 0;
    if (destinationX) {
      if (this._currentPart.moveOriginX == null) { this._currentPart.moveOriginX = this._currentPart.x; }
      const diffX = destinationX - this._currentPart.moveOriginX;
      const motionX = (diffX * v);
      const pmotionX = (diffX * prevv);
      dx = motionX - pmotionX;
    }

    const destinationY = this._currentPart.dy;
    let dy = 0;
    if (destinationY) {
      if (this._currentPart.moveOriginY == null) { this._currentPart.moveOriginY = this._currentPart.y; }
      const diffY = destinationY - this._currentPart.moveOriginY;
      const motionY = (diffY * v);
      const pmotionY = (diffY * prevv);
      dy = motionY - pmotionY;
    }

    if (this.updateMovementVisuals != null) {
      let angle;
      if (this._currentPart.rotation) {
        angle = Math.atan2(dy, dx);
        angle *= (180 / Math.PI);
        angle = (angle + 360 + 180) % 360;
      } else {
        angle = undefined;
      }

      this.updateMovementVisuals(angle, dx, dy, dt);
    }

    return this.shift(dx, dy);
  }
}
);

