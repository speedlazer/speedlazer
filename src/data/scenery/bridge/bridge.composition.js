export default {
  "city.bridge.foot": {
    attributes: {
      width: 512,
      height: 288
    },
    sprites: [["cityBridge", { z: -305, horizon: [0.4, 0.4] }]]
  },
  "city.bridge.deck": {
    attributes: {
      width: 1024,
      height: 128,
      ro: [934, 90]
    },
    hitbox: [0, 0, 1024, 0, 1024, 40, 0, 40],
    spriteAttributes: {
      accentColor: "#2ba04c"
    },
    sprites: [
      ["bridgeDeck", { z: 0, x: 4, key: "deck" }],
      ["bridgeDeck", { z: 1, x: 512, flipX: true, key: "deck2" }]
    ],
    frames: {
      damaged: {
        deck: { sprite: "damagedBridgeDeck" },
        deck2: { sprite: "damagedBridgeDeck" }
      },
      rotateSmall: {
        deck: { sprite: "damagedBridgeDeck" },
        deck2: { sprite: "damagedBridgeDeck" },
        attributes: { rotation: -1 }
      },
      rotateMedium: {
        deck: { sprite: "damagedBridgeDeck" },
        deck2: { sprite: "damagedBridgeDeck" },
        attributes: { rotation: -2 }
      },
      rotateDown: {
        deck: { sprite: "damagedBridgeDeck" },
        deck2: { sprite: "damagedBridgeDeck" },
        attributes: { rotation: -10 }
      }
    }
  },
  "city.bridge.pillar": {
    attributes: {
      width: 192,
      height: 544,
      ro: [96, 544]
    },
    sprites: [["bridgePillar", { z: 0, key: "pillar" }]],
    frames: {
      damaged: {
        pillar: { sprite: "bridgePillarBroken" }
      },
      rotateSmall: {
        attributes: { rotation: -1 },
        pillar: { sprite: "bridgePillarBroken" }
      },
      rotateMedium: {
        attributes: { rotation: -3 },
        pillar: { sprite: "bridgePillarBroken" }
      },
      rotateDown: {
        attributes: { rotation: 80 },
        pillar: { sprite: "bridgePillarBroken", y: 200 }
      }
    }
  },
  "city.bridge.smallPillar": {
    attributes: {
      width: 192,
      height: 189
    },
    sprites: [["bridgePillar", { z: 0, crop: [300, 0, 55, 0] }]]
  }
};
