export default {
  "helicopter.fire": {
    emitter: {
      w: 2,
      h: 2,
      amount: 50,
      fidelity: "high"
    },
    gravity: [0, -500],
    particle: {
      sprite: "explosion7",
      angle: 0,
      angleRandom: 200,
      duration: 250,
      durationRandom: 0,
      velocity: 20,
      velocityRandom: 10,
      startSize: 10,
      endSize: 3,
      startColor: [0.8, 0.7, 0.1, 0.6],
      startColorRandom: [0, 0, 0, 0],
      endColor: [0.8, 0.7, 0.1, 0],
      endColorRandom: [0, 0, 0, 0]
    }
  }
};
