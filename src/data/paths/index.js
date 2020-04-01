export default {
  playerLiftOff: [
    { x: 0.2, y: 0.6 },
    { x: 0.19, y: 0.56 },
    { x: 0.2, y: 0.55 }
  ],
  introHeliLiftOff: [
    { x: 0.3, y: 0.6 },
    { x: 0.32, y: 0.46 },
    { x: 0.3, y: 0.35 },
    { x: 0.15, y: 0.4 },
    { x: -0.15, y: 0.35 }
  ],
  pattern1: [
    { x: 1.1, y: 0.5 },
    { x: 0.9, y: 0.2 },
    { x: 0.7, y: 0.8 },
    { x: 0.5, y: 0.2 },
    { x: 0.3, y: 0.8 },
    { x: 0.1, y: 0.5, events: [[0.2, { setState: ["turned", 500] }]] },
    { x: 0.3, y: 0.2, events: [[0.9, { setState: ["turned", 500] }]] },
    { x: 0.9, y: 0.5 },
    { x: -0.1, y: 0.6 }
  ],
  pattern2: [
    { x: 1.1, y: 0.5 },
    { x: 0.5, y: 0.7 },
    { x: 0.1, y: 0.5, events: [[0.1, { setState: ["turned", 500] }]] },
    { x: 0.3, y: 0.2 },
    { x: 0.8, y: 0.2, events: [[0.6, { setState: ["turned", 500] }]] },
    { x: 0.9, y: 0.4 },
    { x: 0.4, y: 0.5 },
    { x: -0.1, y: 0.2 }
  ],
  sunrise: [
    { x: 0.9, y: 0.7 },
    { x: 0.8, y: 0.3 },
    { x: 0.4, y: 0.1 }
  ],
  evadePattern: [
    { x: 0.1, y: 0.5 },
    { x: 0.9, y: 0.2 },
    { x: 0.7, y: 0.8 },
    { x: 0.5, y: 0.2 },
    { x: 0.3, y: 0.8 },
    { x: 0.1, y: 0.5 },
    { x: 0.3, y: 0.2 },
    { x: 0.9, y: 0.5 },
    { x: 0.4, y: 0.9 },
    { x: 0.1, y: 0.5 }
  ],
  "heli.pattern1": [
    { x: 1.1, y: 0.5 },
    { x: 0.9, y: 0.4 },
    { x: 0.8, y: 0.2 },
    { x: 0.9, y: 0.1 },
    { x: 0.9, y: 0.3 },
    { x: 0.5, y: 0.3 },
    { x: 0.5, y: 0.1 },
    { x: 0.6, y: 0.3 },
    { x: 0.7, y: 0.7 },
    { x: 0.8, y: 0.5 },
    { x: 0.3, y: 0.3 },
    { x: -0.2, y: 0.1 }
  ]
};
