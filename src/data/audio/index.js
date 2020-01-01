import explosion from "src/audio/explosion.ogg";
import laserHit from "src/audio/laser-hit.ogg";
import laserShot from "src/audio/laser-shot.ogg";
import laugh from "src/audio/laugh.ogg";
import powerup from "src/audio/powerup.ogg";

const audiosheets = [
  {
    name: "explosion",
    file: explosion,
    map: {
      explosion: { type: "sfx", start: 0, end: 100 }
    }
  },
  {
    name: "laser-hit",
    file: laserHit,
    map: {
      hit: { type: "sfx", start: 0, end: 100 }
    }
  },
  {
    name: "laser-shot",
    file: laserShot,
    map: {
      shot: { type: "sfx", start: 0, end: 100 }
    }
  },
  {
    name: "laugh",
    file: laugh,
    map: {
      laugh: { type: "sfx", start: 0, end: 100 }
    }
  },
  {
    name: "powerup",
    file: powerup,
    map: {
      powerup: { type: "sfx", start: 0, end: 100 }
    }
  }
];

export default audiosheets;
