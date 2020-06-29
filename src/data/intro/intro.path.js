export default {
  playerLiftOff: {
    path: [
      { x: 0.2, y: 0.6 },
      { x: 0.19, y: 0.56 },
      { x: 0.2, y: 0.55 }
    ]
  },
  "intro.HeliLiftOff": {
    path: [
      { x: 0.3, y: 0.6 },
      { x: 0.32, y: 0.46 },
      { x: 0.3, y: 0.35 },
      { x: 0.15, y: 0.4 },
      { x: -0.25, y: 0.35 }
    ]
  },
  "intro.HeliBackground": {
    path: [
      { x: -0.3, y: 0.3 },
      { x: 0.1, y: 0.37 },
      { x: 0.4, y: 0.3 }
    ]
  },
  "intro.HeliBackgroundCrash": {
    path: [
      { x: 0.4, y: 0.3 },
      { x: 0.35, y: 0.35, events: [[0.9, { event: "Escape1" }]] },
      { x: 0.45, y: 0.4 },
      { x: 0.5, y: 0.3 },
      { x: 0.45, y: 0.2, events: [[0.5, { event: "Escape2" }]] },
      { x: 0.4, y: 0.25, events: [[0.8, { event: "Escape3" }]] },
      { x: 1.2, y: 0.2 }
    ]
  },
  "intro.DroneBackground": {
    path: [
      { x: 1.1, y: 0.3 },
      { x: 0.9, y: 0.2 },
      { x: 0.7, y: 0.3, events: [[0, { setState: ["shoot", 0] }]] },
      {
        x: 0.7,
        y: 0.47,
        events: [
          [0.6, { setState: ["turned", 0] }],
          [0.7, { setState: ["eyeMove", 0] }]
        ]
      },
      { x: 0.8, y: 0.3 },
      { x: 0.95, y: 0.15 },
      { x: 1.2, y: 0.1 }
    ]
  }
};
