export default {
  "City.Sunrise": {
    checkpoints: [
      {
        composables: [["night", { key: "night" }]],
        backgroundColor: "#000000",
        timeline: {
          defaultDuration: 20000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "middle" }
          ]
        }
      },
      {
        composables: [
          ["night", { key: "night", frame: "middle" }],
          ["sky", { key: "sky", frame: "default" }]
        ],
        backgroundColor: "#000000",
        timeline: {
          defaultDuration: 30000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "end" },
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#000020" },

            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn2" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#72261b" }
          ]
        }
      },
      {
        composables: [
          ["night", { key: "night", frame: "end" }],
          ["sky", { key: "sky", frame: "dawn2" }]
        ],
        backgroundColor: "#72261b",
        timeline: {
          defaultDuration: 30000,
          transitions: [
            { key: "sky", start: 0.0, end: 1.0, targetFrame: "dawn3" },
            { start: 0.0, end: 1.0, targetBackgroundColor: "#d39915" }
          ]
        }
      },
      {
        composables: [["sky", { key: "sky", frame: "dawn3" }]],
        backgroundColor: "#d39915",
        timeline: {
          defaultDuration: 30000,
          transitions: [
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn4" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#f7e459" },

            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn5" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#d6d5d5" }
          ]
        }
      }
    ]
  }
};
