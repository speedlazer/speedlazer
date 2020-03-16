export default {
  "City.Sunrise": {
    checkpoints: [
      {
        composables: [
          ["background.night", { key: "night" }],
          ["background.sky", { key: "sky", frame: "default" }]
        ],
        backgroundColor: "#000010",
        timeline: {
          defaultDuration: 60000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "middle" },
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn" },
            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn2" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#030820" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#0F1630" }
          ]
        }
      },
      {
        composables: [
          ["background.night", { key: "night", frame: "middle" }],
          ["background.sky", { key: "sky", frame: "dawn2" }]
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "large", relativeX: 0.9, relativeY: 0.7 }
          ]
        ],
        backgroundColor: "#0F1630",
        timeline: {
          defaultDuration: 60000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "end" },
            { key: "sky", start: 0.0, end: 0.3, targetFrame: "dawn3" },
            { key: "sky", start: 0.3, end: 0.7, targetFrame: "dawn4" },
            { key: "sky", start: 0.7, end: 1.0, targetFrame: "dawn5" },
            { start: 0.0, end: 0.3, targetBackgroundColor: "#191F3D" },
            { start: 0.3, end: 0.85, targetBackgroundColor: "#27273D" },
            { start: 0.85, end: 1.0, targetBackgroundColor: "#FD7321" },
            {
              key: "sun",
              start: 0.5,
              end: 1.0,
              path: {
                name: "sunrise",
                start: 0.0,
                end: 0.2
              }
            }
          ]
        }
      },
      {
        composables: [
          ["background.night", { key: "night", frame: "end" }],
          ["background.sky", { key: "sky", frame: "dawn5" }]
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "large", relativeX: 0.848, relativeY: 0.42 }
          ]
        ],
        backgroundColor: "#FD7321",
        timeline: {
          defaultDuration: 60000,
          transitions: [
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn6" },
            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn7" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#FDAB3A" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#FCC67B" },
            { start: 0.0, end: 1.0, key: "sun", targetState: "full" },
            {
              key: "sun",
              start: 0.0,
              end: 1.0,
              path: {
                name: "sunrise",
                start: 0.2,
                end: 0.4
              }
            },
            {
              key: "night",
              start: 1.0,
              end: 1.0,
              remove: true
            }
          ]
        }
      },
      {
        composables: [["background.sky", { key: "sky", frame: "dawn7" }]],
        entities: [
          ["Sun", { key: "sun", state: "full", relativeX: 0.8, relativeY: 0.3 }]
        ],
        backgroundColor: "#FCC67B",
        timeline: {
          defaultDuration: 120000,
          transitions: [
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn8" },
            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn9" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#F3D7B1" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#BABCD9" },
            { start: 0.0, end: 1.0, key: "sun", targetState: "default" },
            {
              key: "sun",
              start: 0.0,
              end: 1.0,
              path: {
                name: "sunrise",
                start: 0.4,
                end: 1.0
              }
            }
          ]
        }
      }
    ]
  },
  "City.Intro": {
    checkpoints: [
      {
        entities: [
          ["IntroShip", { key: "ship", relativeX: -0.3, relativeY: 0.8 }]
        ],
        timeline: {
          defaultDuration: 1500,
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
          defaultDuration: 2000,
          transitions: [
            { start: 0.0, end: 0.3, key: "ship", targetState: "t2o" },
            { start: 0.3, end: 0.5, key: "ship", targetState: "t2r" },
            { start: 0.7, end: 1.0, key: "heli", targetState: "flying" },
            { start: 0.5, end: 0.7, key: "ship", targetState: "shipStart" },
            { start: 0.9, end: 1.0, key: "ship", targetState: "shipLiftOff" }
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
          defaultDuration: 2000,
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
              path: { name: "introHeliLiftOff", start: 0.0, end: 0.2 },
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
          defaultDuration: 12000,
          transitions: [
            {
              start: 0.0,
              end: 0.3,
              key: "heli",
              path: { name: "introHeliLiftOff", start: 0.2, end: 1.0 }
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
