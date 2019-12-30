export default {
  waterSplashes: {
    emitter: {
      w: 1300,
      h: 10,
      amount: 500
    },
    gravity: [-80, 5],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 20,
      velocity: 10,
      startSize: 30,
      endSize: 30,
      startColor: [1.0, 1.0, 1.0, 0.8],
      endColor: [0.8, 0.8, 0.8, 0],
      endColorRandom: [0.1, 0.1, 0, 0.2]
    }
  },
  "ship.trail": {
    emitter: {
      w: 2,
      h: 2,
      amount: 200
    },
    gravity: [-150, 0],
    particle: {
      sprite: "explosion7",
      angle: 180,
      angleRandom: 0,
      duration: 500,
      durationRandom: 0,
      velocity: 200,
      velocityRandom: 10,
      startSize: 18,
      endSize: 1,
      startColor: [0.9, 0.5, 0.5, 0.6],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.9, 0.2, 0.2, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  "ship.reverse": {
    emitter: {
      w: 2,
      h: 2,
      amount: 200
    },
    gravity: [150, 0],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 0,
      duration: 500,
      durationRandom: 0,
      velocity: 200,
      velocityRandom: 10,
      startSize: 5,
      endSize: 1,
      startColor: [0.9, 0.5, 0.5, 0.6],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.9, 0.2, 0.2, 0],
      endColorRandom: [0, 0, 0, 0]
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
  "drone.trail": {
    emitter: {
      w: 2,
      h: 2,
      amount: 35
    },
    gravity: [0, 0],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 0,
      duration: 50,
      durationRandom: 0,
      velocity: 0,
      velocityRandom: 10,
      startSize: 10,
      endSize: 1,
      startColor: [0.5, 0.5, 0.9, 0.6],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.2, 0.2, 0.9, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  "drone.smoke": {
    emitter: {
      w: 2,
      h: 2,
      amount: 400,
      duration: 300
    },
    gravity: [0, -50],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 360,
      duration: 900,
      durationRandom: 0,
      velocity: 20,
      velocityRandom: 40,
      startSize: 15,
      endSize: 5,
      startColor: [0.1, 0.1, 0.1, 0.6],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.3, 0.3, 0.3, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  explosion: {
    emitter: {
      w: 2,
      h: 2,
      amount: 200,
      duration: 500,
      mode: "expand"
    },
    gravity: [0, 40],
    particle: {
      sprite: "explosion7",
      angles: [0, 20, 100, 180, 230, 330],
      duration: 1000,
      durationRandom: 0,
      velocity: 50,
      velocityRandom: 10,
      startSize: 30,
      endSize: 1,
      startColor: [0.3, 0.2, 0.1, 1],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.1, 0.1, 0.1, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  sparks: {
    emitter: {
      w: 2,
      h: 2,
      amount: 200,
      duration: 550
    },
    gravity: [0, 70],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 60,
      duration: 1000,
      durationRandom: 0,
      velocity: 90,
      velocityRandom: 0,
      startSize: 2,
      startSizeRandom: 0,
      endSize: 2,
      endSizeRandom: 0,
      startColor: [1.0, 1.0, 0.0, 0.6],
      startColorRandom: [0, 0, 0, 0],
      endColor: [1.0, 1.0, 0.0, 0.2],
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
      startColor: [0.1, 0.1, 0.1, 1],
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
