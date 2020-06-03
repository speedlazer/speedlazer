export default {
  "powerup.pickup": {
    emitter: {
      w: 2,
      h: 2,
      amount: 600,
      duration: 300
    },
    gravity: [0, -50],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 360,
      duration: 1000,
      durationRandom: 0,
      velocity: 120,
      velocityRandom: 40,
      startSize: 15,
      endSize: 5,
      startColor: [0.7, 0.1, 0.1, 0.6],
      endColor: [0.7, 0.3, 0.3, 0]
    }
  },
  waterSplashes: {
    emitter: {
      w: 1300,
      h: 10,
      amount: 500,
      fidelity: "low"
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
  "player.trail": {
    emitter: {
      w: 2,
      h: 2,
      amount: 200,
      fidelity: "high"
    },
    particle: {
      sprite: "explosion7",
      angle: 180,
      angleRandom: 0,
      duration: 500,
      durationRandom: 0,
      velocity: 200,
      velocityRandom: 10,
      startSize: 12,
      endSize: 1,
      startColor: [1.0, 0.8, 0.5, 0.6],
      startColorRandom: [0, 0.05, 0, 0],
      endColor: [0.9, 0.2, 0.2, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  "player.trail2": {
    emitter: {
      w: 2,
      h: 2,
      amount: 200,
      fidelity: "high"
    },
    particle: {
      sprite: "explosion7",
      angle: 180,
      angleRandom: 0,
      duration: 500,
      durationRandom: 0,
      velocity: 200,
      velocityRandom: 10,
      startSize: 8,
      endSize: 1,
      startColor: [1.0, 0.8, 0.5, 0.6],
      startColorRandom: [0, 0.05, 0, 0],
      endColor: [0.9, 0.2, 0.2, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  "player.reverse": {
    emitter: {
      w: 2,
      h: 2,
      amount: 200,
      fidelity: "high"
    },
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
      startColor: [1.0, 0.8, 0.5, 0.6],
      startColorRandom: [0, 0.05, 0, 0],
      endColor: [0.9, 0.2, 0.2, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  "missile.trail": {
    emitter: {
      w: 2,
      h: 2,
      amount: 200,
      fidelity: "high"
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
      startColor: [0.7, 0.7, 0.5, 0.6],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.3, 0.3, 0.3, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  "drone.trail": {
    emitter: {
      w: 2,
      h: 2,
      amount: 50,
      fidelity: "high"
    },
    gravity: [0, 0],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 0,
      duration: 200,
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
      duration: 500
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
  electric: {
    emitter: {
      w: 70,
      h: 15,
      amount: 150,
      duration: 1500
    },
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 20,
      duration: 800,
      durationRandom: 0,
      velocity: 20,
      velocityRandom: 0,
      startSize: 4,
      startSizeRandom: 2,
      endSize: 2,
      endSizeRandom: 1,
      startColor: [1.0, 1.0, 0.0, 0.4],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.2, 0.5, 1.0, 0.1],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  sparks: {
    emitter: {
      w: 2,
      h: 2,
      amount: 200,
      duration: 350
    },
    gravity: [0, 200],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 70,
      duration: 500,
      durationRandom: 0,
      velocity: 90,
      velocityRandom: 0,
      startSize: 2,
      startSizeRandom: 0,
      endSize: 3,
      endSizeRandom: 2,
      startColor: [1.0, 1.0, 0.0, 0.6],
      startColorRandom: [0, 0, 0, 0],
      endColor: [1.0, 1.0, 0.0, 0.2],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  laserHit: {
    emitter: {
      w: 4,
      h: 4,
      amount: 200,
      duration: 500
    },
    gravity: [0, 100],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 70,
      duration: 500,
      durationRandom: 0,
      velocity: 50,
      velocityRandom: 0,
      startSize: 10,
      startSizeRandom: 4,
      endSize: 4,
      endSizeRandom: 2,
      startColor: [1.0, 0.4, 0.0, 0.8],
      startColorRandom: [0.2, 0.1, 0.0, 0],
      endColor: [1.0, 0.4, 0.0, 0.2],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  laserCharge: {
    emitter: {
      w: 2,
      h: 2,
      amount: 70,
      reverse: true
    },
    gravity: [0, 10],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 360,
      duration: 800,
      durationRandom: 0,
      velocity: 100,
      velocityRandom: 15,
      startSize: 6,
      startSizeRandom: 1,
      endSize: 1,
      endSizeRandom: 0,
      startColor: [1.0, 0.2, 0.0, 0.8],
      startColorRandom: [0, 0, 0, 0],
      endColor: [1.0, 1.0, 0.0, 0.2],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  "player.laserCharge": {
    emitter: {
      w: 2,
      h: 2,
      amount: 70,
      reverse: true
    },
    gravity: [0, 10],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 60,
      duration: 500,
      durationRandom: 0,
      velocity: 100,
      velocityRandom: 15,
      startSize: 6,
      startSizeRandom: 1,
      endSize: 1,
      endSizeRandom: 0,
      startColor: [1.0, 0.2, 0.0, 0.8],
      startColorRandom: [0.9, 0, 0, 0],
      endColor: [1.0, 1.0, 0.3, 0.2],
      endColorRandom: [0, 0, 0, 0]
    }
  },
  smoke: {
    emitter: {
      w: 160,
      h: 20,
      amount: 300
    },
    gravity: [20, -60],
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
      angleRandom: 50,
      velocity: 120,
      startSize: 10,
      endSize: 10,
      startColor: [1, 1.0, 1.0, 0.8],
      startColorRandom: [0, 0.1, 0, 0.2],
      endColor: [0.1, 0.1, 0.1, 0],
      endColorRandom: [0, 0, 0, 0.2]
    }
  },
  shells: {
    emitter: {
      w: 10,
      h: 10,
      amount: 170,
      duration: 200
    },
    gravity: [0, 160],
    particle: {
      sprite: "bulletShell",
      angle: -50,
      angleRandom: 20,
      duration: 1200,
      velocity: 120,
      startSize: 20,
      endSize: 20,
      startColor: [0.5, 0.6, 0.2, 1.0],
      endColor: [0.5, 0.6, 0.2, 0.3]
    }
  },
  forceField: {
    emitter: {
      w: 200,
      h: 150,
      amount: 170
    },
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 180,
      duration: 800,
      velocity: 2,
      startSize: 2,
      endSize: 4,
      startColor: [0.7, 0.7, 1.0, 0.8],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.2, 0.2, 0.4, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  }
};
