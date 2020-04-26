import bgMusic1 from "./symsonic-hero.mp3";
import effects from "./effects.ogg";

const audiosheets = [
  {
    name: "effects",
    file: effects,
    map: {
      explosion: { type: "sfx", start: 0, end: 629 },
      hit: { type: "sfx", start: 629, end: 896 },
      shot: { type: "sfx", start: 896, end: 1349, volume: 0.2 },
      laugh: { type: "sfx", start: 1349, end: 3044 },
      powerup: { type: "sfx", start: 3044, end: 3950 }
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
