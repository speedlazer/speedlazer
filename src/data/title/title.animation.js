export default {
  "title.Intro": {
    checkpoints: [
      {
        composables: [
          ["background.night", { key: "stars" }],
          ["title.gradient", { key: "fadeIn" }],
          [
            "title.ship",
            {
              key: "ship",
              relativeX: 0.35,
              relativeY: 0.45,
              frame: "far"
            }
          ]
        ],
        backgroundColor: "#000010",
        timeline: {
          defaultDuration: 3000,
          transitions: [
            {
              key: "ship",
              start: 0.0,
              end: 1.0,
              path: {
                data: [
                  { x: 0.0, y: 0.8 },
                  { x: 0.1, y: 0.7 },
                  { x: -0.05, y: 0.7 }
                ]
              }
            },
            { key: "ship", start: 0.2, end: 1.0, targetFrame: "close" },
            { key: "fadeIn", start: 0.0, end: 0.2, targetFrame: "reveal" }
          ]
        }
      }
    ]
  }
};
