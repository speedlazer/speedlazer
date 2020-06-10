import { setGameSpeed } from "./gameSpeed";
import ParticleEmitter from "src/components/ParticleEmitter";
import PausableMotion from "src/components/PausableMotion";
import audio from "src/lib/audio";

let paused = false;

export const isPaused = () => paused;

export const togglePause = () => {
  paused = !paused;

  if (paused) {
    setGameSpeed(0.0);
    audio.pauseAudio();

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
    audio.resumeAudio();
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
