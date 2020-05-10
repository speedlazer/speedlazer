import bgMusic1 from "./symsonic-hero.mp3";
import effects from "./effects.ogg";

const audiosheets = [
  {
    name: "effects",
    file: effects,
    map: [
      { name: "explosion", type: "sfx", duration: 629 },
      { name: "gun-shot", type: "sfx", duration: 295 },
      {
        name: "helicopter",
        type: "sfx",
        duration: 409,
        loop: true,
        volume: 0.4
      },
      { name: "laser-hit", type: "sfx", duration: 267 },
      { name: "laser-shot", type: "sfx", duration: 453, volume: 0.2 },
      { name: "laugh", type: "sfx", duration: 1695 },
      { name: "powerup", type: "sfx", duration: 906 }
    ]
  },
  {
    name: "hero",
    file: bgMusic1,
    map: [
      {
        name: "hero",
        type: "music",
        loop: true,
        loopEnd: 3 * 60 + 55.682,
        loopStart: 69.862
      }
    ]
  }
];

export default audiosheets;
