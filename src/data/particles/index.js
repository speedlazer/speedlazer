export default {
  waterSplashes: {
    emitter: {
      w: 1250,
      h: 10,
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
      startColorRandom: [0.02, 0.02, 0.02, 0.2],
      endColor: [0.8, 0.8, 0.8, 0],
      endColorRandom: [0.1, 0.1, 0, 0.2]
    }
  },
  "missile.trail": {
    emitter: {
      w: 2,
      h: 2,
      amount: 200
    },
    gravity: [0, 0],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 0,
      duration: 1000,
      durationRandom: 0,
      velocity: 0,
      velocityRandom: 0,
      startSize: 10,
      endSize: 1,
      startColor: [0.3, 0.3, 0.3, 0.6],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.3, 0.3, 0.3, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  smoke: {
    emitter: {
      w: 160,
      h: 20,
      amount: 300
    },
    gravity: [20, -90],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 20,
      duration: 2500,
      durationRandom: 500,
      velocity: 10,
      startSize: 30,
      endSize: 80,
      startColor: [0.3, 0.3, 0.3, 1],
      startColorRandom: [0, 0, 0, 0.2],
      endColor: [0.1, 0.1, 0.1, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  smoke2: {
    emitter: {
      w: 200,
      h: 20,
      amount: 300
    },
    gravity: [20, -90],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 20,
      duration: 2500,
      durationRandom: 500,
      velocity: 10,
      startSize: 30,
      endSize: 80,
      startColor: [0.3, 0.3, 0.3, 1],
      startColorRandom: [0, 0, 0, 0.2],
      endColor: [0.1, 0.1, 0.1, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  fountain: {
    emitter: {
      w: 10,
      h: 10,
      amount: 300
    },
    gravity: [0, 90],
    particle: {
      sprite: "explosion7",
      angle: -90,
      angleRandom: 20,
      velocity: 120,
      startSize: 10,
      endSize: 10,
      startColor: [1, 1.0, 1.0, 0.8],
      startColorRandom: [0, 0.1, 0, 0.2],
      endColor: [0.1, 0.1, 0.1, 0],
      endColorRandom: [0, 0, 0, 0.2]
    }
  }
};
