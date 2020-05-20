import bgMusic1 from "./symsonic-hero.mp3";
import bgMusic2 from "./symsonic-interactive.ogg";
import effects from "./effects.ogg";

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
        volume: 0.4
      },
      { name: "laser-charge", type: "sfx", duration: 1674, volume: 0.3 },
      { name: "laser-fire", type: "sfx", duration: 1725, volume: 1.2 },
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
  },
  {
    name: "interactive",
    file: bgMusic2,
    map: [
      {
        name: "layer.base",
        type: "layer",
        loop: true,
        duration: 32000
      },
      {
        name: "layer.bossfight",
        type: "layer",
        loop: true,
        duration: 32000
      },
      {
        name: "layer.excitement",
        type: "layer",
        loop: true,
        duration: 32000
      },
      {
        name: "layer.normal",
        type: "layer",
        loop: true,
        duration: 32000
      },
      {
        name: "layer.someStress",
        type: "layer",
        loop: true,
        duration: 32000
      },
      {
        name: "pattern.default",
        type: "pattern",
        tracks: ["layer.base", "layer.normal"],
        loop: true,
        blockDuration: 8000,
        duration: 32000
      },
      {
        name: "pattern.excitement",
        type: "pattern",
        tracks: ["layer.base", "layer.excitement"],
        loop: true,
        blockDuration: 8000,
        duration: 32000
      },
      {
        name: "pattern.someStress",
        type: "pattern",
        tracks: ["layer.base", "layer.someStress"],
        loop: true,
        blockDuration: 8000,
        duration: 32000
      },
      {
        name: "pattern.ease",
        type: "pattern",
        tracks: ["layer.normal"],
        loop: true,
        blockDuration: 8000,
        duration: 32000
      },
      {
        name: "pattern.anticipation",
        type: "pattern",
        tracks: ["layer.excitement"],
        loop: true,
        blockDuration: 8000,
        duration: 32000
      },
      {
        name: "pattern.bossfight",
        type: "pattern",
        tracks: ["layer.base", "layer.bossfight"],
        loop: true,
        blockDuration: 8000,
        duration: 32000
      }
    ]
  }
];

export default audiosheets;
