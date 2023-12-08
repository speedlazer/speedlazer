export default {
  "bird.straight": {
    habitat: {
      scenery: "garden.Grass",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["city.Sunrise", 2],
      entity: "WarBird",
    },
    path: [
      { x: 1.1, y: 0.5 },
      { x: -0.1, y: 0.5 },
    ],
  },
  "bird.pattern1": {
    habitat: {
      scenery: "garden.Grass",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["city.Sunrise", 2],
      entity: "WarBird",
    },
    path: [
      { x: 1.1, y: 0.5 },
      { x: 0.9, y: 0.2 },
      { x: 0.7, y: 0.8 },
      { x: 0.5, y: 0.2 },
      { x: 0.3, y: 0.8 },
      { x: 0.1, y: 0.5, events: [[0.2, { setState: ["turned", 500] }]] },
      { x: 0.3, y: 0.2, events: [[0.9, { setState: ["turned", 500] }]] },
      { x: 0.9, y: 0.5 },
      { x: -0.1, y: 0.6 },
    ],
  },
  "bird.pattern2": {
    habitat: {
      scenery: "garden.Grass",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["city.Sunrise", 2],
      entity: "WarBird",
    },
    path: [
      { x: 1.1, y: 0.5 },
      { x: 0.5, y: 0.7 },
      { x: 0.1, y: 0.5, events: [[0.1, { setState: ["turned", 500] }]] },
      { x: 0.3, y: 0.2 },
      { x: 0.8, y: 0.2, events: [[0.6, { setState: ["turned", 500] }]] },
      { x: 0.9, y: 0.4 },
      { x: 0.4, y: 0.5 },
      { x: -0.1, y: 0.2 },
    ],
  },
  "bird.pattern3": {
    habitat: {
      scenery: "garden.Grass",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["city.Sunrise", 2],
      entity: "WarBird",
    },
    path: [
      { x: 0.5, y: -0.1 },
      { x: 0.5, y: 0.2 },
      { x: 0.7, y: 0.31 },
      { x: 0.8, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: -0.1, y: 0.3 },
    ],
  },
  "bird.pattern4": {
    habitat: {
      scenery: "garden.Grass",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["city.Sunrise", 2],
      entity: "WarBird",
    },
    path: [
      { x: 0.5, y: 1.11 },
      { x: 0.5, y: 0.8 },
      { x: 0.7, y: 0.8 },
      { x: 0.93, y: 0.69 },
      { x: 0.8, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: -0.1, y: 0.7 },
    ],
  },
  "bird.pattern5": {
    habitat: {
      scenery: "garden.Grass",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["city.Sunrise", 2],
      entity: "WarBird",
    },
    path: [
      { x: -0.2, y: 0.5, events: [[0.0, { setState: ["turned", 0] }]] },
      { x: 0.5, y: 0.8 },
      { x: 0.93, y: 0.69, events: [[0.0, { setState: ["turned", 0] }]] },
      { x: 0.8, y: 0.5 },
      { x: 0.5, y: 0.5 },
      { x: -0.1, y: 0.7 },
    ],
  },
  "bird.pattern6": {
    habitat: {
      scenery: "garden.Grass",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["city.Sunrise", 2],
      entity: "WarBird",
    },
    path: [
      { x: 1.1, y: 0.2 },
      { x: 0.2, y: 0.4, events: [[0.0, { setState: ["turned", 0] }]] },
      { x: 0.6, y: 0.2 },
      { x: 1.1, y: 0.2 },
    ],
  },
};
