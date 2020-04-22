import explosion from "./explosion.ogg";
import laserHit from "./laser-hit.ogg";
import laserShot from "./laser-shot.ogg";
import laugh from "./laugh.ogg";
import powerup from "./powerup.ogg";
import bgMusic1 from "./symsonic-hero.mp3";

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
      shot: { type: "sfx", start: 0, end: 100, volume: 0.2 }
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
  },
  {
    name: "hero",
    file: bgMusic1,
    map: {
      hero: { type: "music", start: 0, end: 100 }
    }
  }
];

export default audiosheets;
