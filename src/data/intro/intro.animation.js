export default {
  "city.Intro": {
    checkpoints: [
      {
        entities: [
          ["IntroShip", { key: "ship", relativeX: -0.3, relativeY: 0.8 }]
        ],
        timeline: {
          defaultDuration: 3000,
          transitions: [
            {
              key: "ship",
              start: 0.0,
              end: 1.0,
              path: {
                data: [
                  { x: -0.3, y: 0.8 },
                  { x: -0.2, y: 0.8 }
                ]
              }
            },
            { start: 0.4, end: 0.6, key: "ship", targetState: "t2o" },
            { start: 0.6, end: 1.0, key: "ship", targetState: "t2r" }
          ]
        }
      },
      {
        entities: [
          ["IntroShip", { key: "ship", relativeX: -0.2, relativeY: 0.8 }]
        ],
        timeline: {
          defaultDuration: 500,
          transitions: [
            {
              key: "ship",
              start: 0.8,
              targetState: "heliStart"
            }
          ]
        }
      },
      {
        entities: [
          [
            "IntroShip",
            { key: "ship", state: "heliStart", relativeX: -0.2, relativeY: 0.8 }
          ],
          [
            "IntroHeli",
            {
              key: "heli",
              detach: true
            }
          ]
        ],
        timeline: {
          defaultDuration: 500,
          transitions: [
            { start: 0.2, end: 1.0, key: "heli", targetState: "flying" },
            { start: 0.0, end: 0.8, key: "ship", targetState: "shipStart" },
            { start: 0.8, end: 1.0, key: "ship", targetState: "shipLiftOff" }
          ]
        }
      },
      {
        entities: [
          [
            "IntroShip",
            {
              key: "ship",
              state: "shipLiftOff",
              relativeX: -0.2,
              relativeY: 0.8
            }
          ],
          ["IntroHeli", { key: "heli", state: "flying", detach: true }],
          [
            "PlayerShip",
            {
              key: "player",
              detach: true,
              state: "flying"
            }
          ]
        ],
        timeline: {
          defaultDuration: 1500,
          transitions: [
            {
              start: 0.0,
              end: 0.5,
              key: "player",
              path: {
                name: "playerLiftOff",
                start: 0.0,
                end: 1
              },
              attributes: {
                z: 10
              }
            },
            {
              start: 0.0,
              end: 1.0,
              key: "heli",
              path: { name: "intro.HeliLiftOff", start: 0.0, end: 0.2 },
              attributes: { z: 14 }
            },
            {
              start: 0.0,
              end: 1,
              key: "ship",
              targetState: "closed",
              path: {
                data: [
                  { x: -0.2, y: 0.8 },
                  { x: -0.1, y: 0.8 }
                ]
              }
            }
          ]
        }
      },
      {
        entities: [
          ["IntroShip", { key: "ship", relativeX: -0.1, relativeY: 0.8 }],
          [
            "IntroHeli",
            {
              key: "heli",
              state: "flying",
              relativeX: 0.466,
              relativeY: 0.458,
              z: 10,
              detach: true
            }
          ]
        ],
        timeline: {
          defaultDuration: 8000,
          transitions: [
            {
              start: 0.0,
              end: 0.35,
              key: "heli",
              path: { name: "intro.HeliLiftOff", start: 0.2, end: 1.0 }
            },
            {
              key: "ship",
              start: 0.1,
              end: 1.0,
              path: {
                data: [
                  { x: -0.1, y: 0.8 },
                  { x: -1.0, y: 0.8 }
                ]
              }
            },
            {
              key: "ship",
              start: 1.0,
              end: 1.0,
              remove: true
            },
            {
              key: "heli",
              start: 1.0,
              end: 1.0,
              remove: true
            }
          ]
        }
      }
    ],
    habitat: {
      scenery: "City.Ocean",
      scrollSpeed: { vx: -100, vy: 0 },
      background: ["City.Sunrise", 0]
    }
  }
};
