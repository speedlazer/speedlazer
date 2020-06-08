import { setGameSpeed } from "./gameSpeed";
import ParticleEmitter from "src/components/ParticleEmitter";
import PausableMotion from "src/components/PausableMotion";
import { pauseAudio, resumeAudio } from "src/lib/audio";

let paused = false;

export const isPaused = () => paused;

export const togglePause = () => {
  paused = !paused;

  if (paused) {
    setGameSpeed(0.0);
    pauseAudio();

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
    resumeAudio();
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
