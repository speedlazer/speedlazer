export default {
  "grass.front": {
    attributes: {
      width: 1024,
      height: 96,
    },
    sprites: [["grassFront", { z: -20, key: "left", horizon: [0.2, 0.0] }]],
  },
  "grass.middle": {
    attributes: {
      width: 768,
      height: 288,
    },
    sprites: [
      ["grassMiddle", { z: -100, w: 768, key: "middle", horizon: [0.6, 0.1] }],
    ],
  },
  "grass.pond": {
    attributes: {
      width: 769,
      height: 288,
    },
    sprites: [
      ["pond", { z: -100, w: 768, key: "middle", horizon: [0.6, 0.1] }],
    ],
  },
  "grass.pondStart": {
    attributes: {
      width: 769,
      height: 288,
    },
    sprites: [
      ["pondStart", { z: -100, w: 768, key: "middle", horizon: [0.6, 0.1] }],
    ],
  },
  "grass.hedge": {
    attributes: {
      width: 384,
      height: 160,
    },
    sprites: [["hedge", { z: -200, w: 666, horizon: [0.3, 0.3] }]],
  },
  "town.roof": {
    attributes: {
      width: 460,
      height: 460,
    },
    sprites: [["roof", { z: -10, horizon: [0.2, 0.0] }]],
    hitbox: [50, 450, 50, 145, 65, 145, 230, 10, 400, 145, 410, 145, 410, 450],
    attachHooks: [
      [
        "chimneyLoc",
        { x: 92, y: 166, z: -5, attachAlign: ["bottom", "center"] },
      ],
      [
        "explosionLoc",
        { x: 92, y: 126, z: -5, attachAlign: ["bottom", "center"] },
      ],
    ],
  },
  "town.chimney": {
    attributes: {
      width: 32,
      height: 128,
    },
    hitbox: [3, 17, 30, 17, 30, 80, 3, 105],
    sprites: [["chimney", { key: "chimney", z: -15, horizon: [0.2, 0.2] }]],
    attachHooks: [
      ["smokeLoc", { x: 14, y: 16, z: -5, attachAlign: ["bottom", "center"] }],
      ["gunLoc", { x: 4, y: -16, z: -5, attachAlign: ["bottom", "center"] }],
    ],
    frames: {
      dead: {
        chimney: { alpha: 0 },
      },
      shootStart: {
        chimney: { scaleX: 1.2, scaleY: 0.8 },
      },
      shootEnd: {
        chimney: { scaleX: 0.9, scaleY: 1.1 },
      },
    },
    animations: {
      shoot: {
        duration: 400,
        repeat: true,
        startEase: { duration: 1, easing: "easeOutQuad" },
        easing: "easeInQuad",
        timeline: [
          {
            start: 0,
            end: 0.2,
            startFrame: "default",
            endFrame: "shootStart",
          },
          {
            start: 0.2,
            end: 0.4,
            startFrame: "shootStart",
            endFrame: "shootEnd",
          },
          {
            start: 0.6,
            end: 0.7,
            startFrame: "shootEnd",
            endFrame: "default",
          },
        ],
      },
    },
  },
  "town.middle": {
    attributes: {
      width: 512,
      height: 256,
    },
    sprites: [["villageSkyline", { z: -300, horizon: [0.4, 0.2] }]],
  },
  "town.middleFull": {
    attributes: {
      width: 512,
      height: 608,
    },
    sprites: [["villageSkylineFull", { z: -550, horizon: [0.4, 0.2] }]],
  },
  "town.skyline": {
    attributes: {
      width: 256,
      height: 128,
    },
    sprites: [["villageDistantSkyline", { z: -550, horizon: [0.5, 0.7] }]],
  },
  "hills.horizon": {
    attributes: {
      width: 512,
      height: 96,
    },
    sprites: [["hillSkyline", { z: -600, horizon: [0.8, 0.6] }]],
  },
  "sinterklaas.present": {
    attributes: {
      width: 32,
      height: 32,
    },
    hitbox: [0, 8, 16, 4, 32, 8, 30, 25, 16, 30, 2, 25],
    sprites: [["present", {}]],
  },
  "city.skyScraper": {
    attributes: {
      width: 512,
      height: 640,
      scale: 2,
    },
    sprites: [
      ["bigBuildingTop", {}],
      ["bigBuildingLayer", { y: 192 }],
      ["bigBuildingLayer", { y: 256 }],
      ["bigBuildingLayer", { y: 384 }],
      ["bigBuildingLayer", { y: 512 }],
    ],
  },
};
