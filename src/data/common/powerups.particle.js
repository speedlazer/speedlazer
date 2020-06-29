export default {
  "powerup.pickup": {
    emitter: {
      w: 2,
      h: 2,
      amount: 600,
      duration: 200
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
  }
};
