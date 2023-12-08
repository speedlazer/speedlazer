import bgMusic1 from "url:./symsonic-hero.mp3";
import bgMusic2 from "url:./zak-120bpm.mp3";
import bgMusic3 from "url:./stoomboot-210bpm.mp3";
import effects from "url:./effects.ogg";

const audiosheets = [
  {
    name: "effects",
    file: effects,
    map: [
      { name: "explosion", type: "sfx", duration: 629 },
      { name: "gun-shot", type: "sfx", duration: 295 },
      { name: "hatch-open", type: "sfx", duration: 1126, volume: 0.4 },
      {
        name: "helicopter",
        type: "sfx",
        duration: 409,
        loop: true,
        volume: 0.4,
      },
      { name: "laser-charge", type: "sfx", duration: 1674, volume: 0.3 },
      { name: "laser-fire", type: "sfx", duration: 1725, volume: 1.2 },
      { name: "laser-hit", type: "sfx", duration: 267 },
      { name: "laser-shot", type: "sfx", duration: 453, volume: 0.2 },
      { name: "laugh", type: "sfx", duration: 1695 },
      { name: "powerup", type: "sfx", duration: 906 },
    ],
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
        loopStart: 69.862,
      },
    ],
  },
  {
    name: "sint",
    file: bgMusic2,
    map: [
      {
        name: "sint",
        type: "music",
        loop: true,
        // loopEnd: 3 * 60 + 55.682,
        // loopStart: 69.862,
      },
    ],
  },
  {
    name: "boss",
    file: bgMusic3,
    map: [
      {
        name: "boss",
        type: "music",
        loop: true,
        // loopEnd: 3 * 60 + 55.682,
        // loopStart: 69.862,
      },
    ],
  },
];

export default audiosheets;
