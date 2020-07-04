export default {
  "city.Sunrise": {
    checkpoints: [
      {
        composables: [
          ["background.night", { key: "night" }],
          ["background.sky", { key: "sky", frame: "default", relativeX: -0.1 }]
        ],
        backgroundColor: "#000010",
        timeline: {
          defaultDuration: 45000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "middle" },
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn" },
            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn2" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#030820" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#0f1630" }
          ]
        }
      },
      {
        composables: [
          ["background.night", { key: "night", frame: "middle" }],
          ["background.sky", { key: "sky", frame: "dawn2", relativeX: -0.1 }],
          [
            "background.horizon",
            {
              key: "stripe",
              frame: "default",
              relativeY: 0.49,
              relativeX: -0.1
            }
          ]
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "large", relativeX: 0.9, relativeY: 0.7 }
          ]
        ],
        backgroundColor: "#0f1630",
        timeline: {
          defaultDuration: 60000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "end" },
            { key: "sky", start: 0.0, end: 0.3, targetFrame: "dawn3" },
            { key: "sky", start: 0.3, end: 0.7, targetFrame: "dawn4" },
            { key: "sky", start: 0.7, end: 1.0, targetFrame: "dawn5" },
            { start: 0.0, end: 0.3, targetBackgroundColor: "#191f3d" },
            { start: 0.3, end: 0.85, targetBackgroundColor: "#27273d" },
            { start: 0.85, end: 1.0, targetBackgroundColor: "#fd7321" },
            {
              key: "stripe",
              start: 0.1,
              end: 0.6,
              path: {
                data: [
                  { x: 0, y: 0.49 },
                  { x: 0, y: 0.46 }
                ]
              }
            },
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
          ["background.sky", { key: "sky", frame: "dawn5", relativeX: -0.1 }],
          [
            "background.horizon",
            {
              key: "stripe",
              frame: "default",
              relativeY: 0.46,
              relativeX: -0.1
            }
          ]
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "large", relativeX: 0.848, relativeY: 0.42 }
          ]
        ],
        backgroundColor: "#fd7321",
        timeline: {
          defaultDuration: 150000,
          transitions: [
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn6" },
            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn7" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#fdab3a" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#fcc67b" },
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
              key: "stripe",
              targetFrame: "dawn",
              start: 0.0,
              end: 0.2,
              path: {
                data: [
                  { x: 0, y: 0.46 },
                  { x: 0, y: 0.43 }
                ]
              }
            },
            {
              key: "stripe",
              start: 0.7,
              end: 1.0,
              path: {
                data: [
                  { x: 0, y: 0.43 },
                  { x: 0, y: 0.8 }
                ]
              }
            },
            {
              key: "night",
              start: 1.0,
              remove: true
            },
            {
              key: "stripe",
              start: 1.0,
              remove: true
            }
          ]
        }
      },
      {
        composables: [
          ["background.sky", { key: "sky", frame: "dawn7", relativeX: -0.1 }]
        ],
        entities: [
          ["Sun", { key: "sun", state: "full", relativeX: 0.8, relativeY: 0.3 }]
        ],
        backgroundColor: "#fcc67b",
        timeline: {
          defaultDuration: 120000,
          transitions: [
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn8" },
            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn9" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#f3d7b1" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#babcd9" },
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
      },
      {
        composables: [
          ["background.sky", { key: "sky", frame: "dawn9", relativeX: -0.1 }]
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "default", relativeX: 0.4, relativeY: 0.1 }
          ]
        ],
        backgroundColor: "#babcd9",
        timeline: {
          defaultDuration: 1000,
          transitions: []
        }
      }
    ],
    habitat: {
      isBackground: true,
      scenery: "city.Ocean",
      scrollSpeed: { vx: -100, vy: 0 }
    }
  }
};
