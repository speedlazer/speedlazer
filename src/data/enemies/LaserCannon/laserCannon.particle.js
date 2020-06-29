export default {
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
  }
};
