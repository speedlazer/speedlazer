export default {
  waterSplashes: {
    emitter: {
      w: 900,
      h: 20,
      amount: 600
    },
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 20,
      velocity: 10,
      startSize: 30,
      endSize: 30,
      startColor: [0.8, 0.8, 0.8, 0.8],
      startColorRandom: [0.1, 0.1, 0, 0.2],
      endColor: [0.8, 0.8, 0.8, 0],
      endColorRandom: [0.1, 0.1, 0, 0.2]
    }
  },
  smoke: {
    emitter: {
      w: 200,
      h: 20,
      amount: 300
    },
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 20,
      velocity: 10,
      startSize: 30,
      endSize: 80,
      startColor: [0.1, 0.1, 0.1, 0.8],
      startColorRandom: [0, 0, 0, 0.2],
      endColor: [0.1, 0.1, 0.1, 0],
      endColorRandom: [0, 0, 0, 0.2]
    }
  }
};
