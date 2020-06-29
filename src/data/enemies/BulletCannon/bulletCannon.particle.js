export default {
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
  }
};
