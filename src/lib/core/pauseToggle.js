import { setGameSpeed } from "./gameSpeed";

let paused = false;

export const isPaused = () => paused;

export const togglePause = () => {
  paused = !paused;

  if (paused) {
    setGameSpeed(0.0);

    Crafty("Delay").each(function() {
      return this.pauseDelays();
    });
    Crafty("Tween").each(function() {
      return this.pauseTweens();
    });
    Crafty("Particles").each(function() {
      return this.pauseParticles();
    });
    Crafty("SpriteAnimation").each(function() {
      return this.pauseAnimation();
    });
    Crafty("PlayerControlledShip").each(function() {
      if (this.disableControls) return;
      this.disabledThroughPause = true;
      this.disableControl();
    });
  } else {
    setGameSpeed(1.0);
    Crafty("Delay").each(function() {
      return this.resumeDelays();
    });
    Crafty("Tween").each(function() {
      return this.resumeTweens();
    });
    Crafty("Particles").each(function() {
      return this.resumeParticles();
    });
    Crafty("SpriteAnimation").each(function() {
      return this.resumeAnimation();
    });
    Crafty("PlayerControlledShip").each(function() {
      if (!this.disabledThroughPause) return;
      this.disabledThroughPause = null;
      this.enableControl();
    });
  }

  Crafty.trigger("GamePause", paused);
};
