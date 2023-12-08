export default {
  "fish.pattern1": {
    habitat: {
      scenery: "garden.Pond",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["city.Sunset", 1],
      entity: "WarFish",
    },
    path: [
      { x: 0.8, y: 0.95 },
      { x: 0.6, y: 0.4 },
      { x: 0.3, y: 1.1 },
    ],
  },
  "fish.pattern2": {
    habitat: {
      scenery: "garden.Pond",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["city.Sunset", 1],
      entity: "WarFish",
    },
    path: [
      { x: 0.1, y: 0.95, events: [[0.0, { setState: ["turned", 500] }]] },
      { x: 0.4, y: 0.1 },
      { x: 0.8, y: 1.1 },
    ],
  },
};
