import { setGameSpeed } from "./gameSpeed";
import ParticleEmitter from "../../components/ParticleEmitter";
import PausableMotion from "../../components/PausableMotion";

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
    Crafty(ParticleEmitter).each(function() {
      return this.pauseParticles();
    });
    Crafty(PausableMotion).each(function() {
      return this.pauseMotion();
    });
  } else {
    setGameSpeed(1.0);
    Crafty("Delay").each(function() {
      return this.resumeDelays();
    });
    Crafty("Tween").each(function() {
      return this.resumeTweens();
    });
    Crafty(ParticleEmitter).each(function() {
      return this.resumeParticles();
    });
    Crafty(PausableMotion).each(function() {
      return this.resumeMotion();
    });
  }

  Crafty.trigger("GamePause", paused);
};
