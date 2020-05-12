export default {
  "powerups.health": {
    attributes: { width: 32, height: 32 },
    sprites: [
      ["powerUpBox", { key: "main", accentColor: "#900000" }],
      ["heart", { z: 1, scale: 0.7, accentColor: "#ff9999" }]
    ],
    animations: {
      default: {
        duration: 1200,
        repeat: true,
        timeline: [
          {
            start: 0.0,
            end: 1.0,
            spriteAnimation: {
              key: "main",
              sprites: [
                "powerUpBox",
                "powerUpBox2",
                "powerUpBox3",
                "powerUpBox2"
              ]
            }
          }
        ]
      }
    }
  }
};
