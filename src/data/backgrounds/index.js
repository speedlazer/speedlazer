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
            { key: "sun", state: "large", relativeX: 0.7, relativeY: 0.8 }
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
        entities: [["Sun", { key: "sun", state: "large" }]],
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
            }
          ]
        }
      },
      {
        composables: [["background.sky", { key: "sky", frame: "dawn7" }]],
        entities: [["Sun", { key: "sun", state: "full" }]],
        backgroundColor: "#FCC67B",
        timeline: {
          defaultDuration: 60000,
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
  }
};
