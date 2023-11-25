import { setGameSpeed } from "./gameSpeed";
import ParticleEmitter from "../../components/ParticleEmitter";
import audio from "../../lib/audio";
import Crafty from "../../crafty";

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
  }

  Crafty.trigger("GamePause", paused);
};
