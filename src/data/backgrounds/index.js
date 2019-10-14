export default {
  "City.Sunrise": {
    checkpoints: [
      {
        composables: [["night", { key: "night" }]],
        backgroundColor: "#000000",
        timeline: {
          defaultDuration: 120000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "middle" }
          ]
        }
      },
      {
        composables: [
          ["night", { key: "night", frame: "middle" }],
          ["sky", { key: "sky", frame: "default" }],
          [
            "sun",
            { key: "sun", frame: "large", relativeX: 0.7, relativeY: 0.8 }
          ]
        ],
        backgroundColor: "#000000",
        timeline: {
          defaultDuration: 120000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "end" },
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#000020" },

            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn2" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#72261b" },
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
          ["night", { key: "night", frame: "end" }],
          ["sky", { key: "sky", frame: "dawn2" }],
          ["sun", { key: "sun", frame: "large" }]
        ],
        backgroundColor: "#72261b",
        timeline: {
          defaultDuration: 120000,
          transitions: [
            { key: "sky", start: 0.0, end: 1.0, targetFrame: "dawn3" },
            { start: 0.0, end: 1.0, targetBackgroundColor: "#d39915" },
            { start: 0.0, end: 1.0, key: "sun", targetFrame: "full" },
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
        composables: [
          ["sky", { key: "sky", frame: "dawn3" }],
          ["sun", { key: "sun", frame: "full" }]
        ],
        backgroundColor: "#d39915",
        timeline: {
          defaultDuration: 180000,
          transitions: [
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn4" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#f7e459" },

            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn5" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#d6d5d5" },
            { start: 0.0, end: 1.0, key: "sun", targetFrame: "default" },
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
