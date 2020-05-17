export default {
  "City.Coast": {
    width: 1023,
    height: 576,
    right: "City.Coast",
    left: "City.Coast",
    backgrounds: [["City.Sunrise", 2]],
    altitudes: [0, 100],
    elements: [
      {
        x: 0,
        y: -85,
        composition: "ocean.front"
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid", "GravityLiquid"],
        w: 1024,
        h: 45,
        attributes: { liquidParticles: "waterSplashes", liquidDensity: 8 }
      },
      {
        x: 0,
        y: 5,
        composition: "ocean.middle",
        distance: 0.5
      },
      {
        x: 0,
        y: -30,
        composition: "ocean.horizon",
        distance: 0.25
      },
      {
        x: 0,
        y: -46,
        composition: "city.horizon",
        distance: 0.25
      }
    ]
  },
  "City.CoastStart": {
    width: 1023,
    height: 576,
    right: "City.Coast",
    left: "City.Ocean",
    backgrounds: [["City.Sunrise", 1]],
    altitudes: [0, 250],
    elements: [
      {
        x: 0,
        y: -85,
        composition: "ocean.front"
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid", "GravityLiquid"],
        w: 1024,
        h: 45,
        attributes: { liquidParticles: "waterSplashes", liquidDensity: 8 }
      },
      {
        x: 0,
        y: 5,
        composition: "ocean.middle",
        distance: 0.5
      },
      {
        x: 0,
        y: -30,
        composition: "ocean.horizon",
        distance: 0.25
      },
      {
        x: 0,
        y: -46,
        composition: "city.horizonStart",
        distance: 0.25
      }
    ]
  },
  "City.Ocean": {
    width: 1023,
    height: 576,
    right: "City.Ocean",
    left: "City.Ocean",
    backgrounds: [["City.Sunrise", 0]],
    altitudes: [0, 250],
    elements: [
      {
        x: 0,
        y: -85,
        composition: "ocean.front"
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid", "GravityLiquid"],
        w: 1024,
        h: 45,
        attributes: { liquidParticles: "waterSplashes", liquidDensity: 8 }
      },
      {
        x: 0,
        y: 5,
        composition: "ocean.middle",
        distance: 0.5
      },
      {
        x: 0,
        y: -30,
        composition: "ocean.horizon",
        distance: 0.25
      }
    ]
  },
  "City.BayStart": {
    width: 1023,
    height: 576,
    right: "City.Bay",
    left: "City.Coast",
    backgrounds: [["City.Sunrise", 2]],
    altitudes: [0, 250],
    elements: [
      {
        x: 0,
        y: -85,
        composition: "ocean.front"
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid", "GravityLiquid"],
        w: 1024,
        h: 45,
        attributes: { liquidParticles: "waterSplashes", liquidDensity: 8 }
      },
      {
        x: 0,
        y: 5,
        composition: "ocean.middle",
        distance: 0.5
      },
      {
        x: 0,
        y: -30,
        composition: "ocean.horizon",
        distance: 0.25
      },
      {
        x: 0,
        y: -46,
        composition: "city.horizon",
        distance: 0.25
      },
      {
        x: 0,
        y: -148,
        composition: "city.cityStart",
        distance: 0.5
      }
    ]
  },
  "City.Bay": {
    width: 1023,
    height: 576,
    left: "City.Bay",
    right: "City.Bay",
    backgrounds: [["City.Sunrise", 3]],
    altitudes: [0, 250],
    elements: [
      {
        x: 0,
        y: -85,
        z: -20,
        composition: "ocean.front"
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid", "GravityLiquid"],
        w: 1024,
        h: 45,
        attributes: { liquidParticles: "waterSplashes", liquidDensity: 8 }
      },
      {
        x: 0,
        y: 5,
        composition: "ocean.middle",
        distance: 0.5
      },
      {
        x: 0,
        y: -30,
        composition: "ocean.horizon",
        distance: 0.25
      },
      {
        x: 0,
        y: -46,
        composition: "city.horizon",
        distance: 0.25
      },
      {
        x: 0,
        y: -148,
        composition: "city.city",
        distance: 0.5
      },
      {
        x: 0,
        y: -180,
        composition: "city.layer2",
        distance: 0.375
      },
      {
        x: 240,
        y: -180,
        w: 60,
        h: 105,
        components: ["SunBlock"],
        distance: 0.375
      }
    ]
  },
  "City.BayFull": {
    width: 1023,
    height: 576,
    left: "City.BayFull",
    right: "City.BayFull",
    backgrounds: [["City.Sunrise", 3]],
    altitudes: [0, 250, 500, 700, 900],
    elements: [
      {
        x: 0,
        y: -85,
        z: -20,
        composition: "ocean.front"
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid", "GravityLiquid"],
        w: 1024,
        h: 45,
        attributes: { liquidParticles: "waterSplashes", liquidDensity: 8 }
      },
      {
        x: 0,
        y: 5,
        composition: "ocean.middle",
        distance: 0.5
      },
      {
        x: 0,
        y: -45,
        composition: "city.cityDistance",
        distance: 0.25
      },
      {
        x: 0,
        y: -148,
        composition: "city.city",
        distance: 0.5
      },
      {
        x: 0,
        y: -180,
        composition: "city.layer2",
        distance: 0.375
      },
      {
        x: 240,
        y: -180,
        w: 60,
        h: 105,
        components: ["SunBlock"],
        distance: 0.375
      }
    ]
  },
  "City.Bridge": {
    width: 1023,
    height: 576,
    left: "City.Bay",
    right: "City.BayFull",
    backgrounds: [["City.Sunrise", 3]],
    elements: [
      {
        x: 0,
        y: -85,
        z: -20,
        composition: "ocean.front"
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid", "GravityLiquid"],
        w: 1024,
        h: 45,
        attributes: { liquidParticles: "waterSplashes", liquidDensity: 8 }
      },
      {
        x: 0,
        y: 5,
        composition: "ocean.middle",
        distance: 0.5
      },
      {
        x: 0,
        y: -45,
        composition: "city.cityDistance",
        distance: 0.25
      },
      {
        x: 0,
        y: -20,
        composition: "city.bridge.foot",
        distance: 0.5
      },
      {
        x: 0,
        y: -760,
        z: 300,
        components: ["SunBlock", "BridgeFrontDeck"],
        composition: [
          "city.bridge.deck",
          {
            attributes: { scale: 1.1 },
            spriteAttributes: {
              accentColor: "#b15a5a",
              lightness: 0.6
            }
          }
        ],
        distance: 1.1
      },
      {
        x: 0,
        y: -590,
        z: 300,
        components: ["PillarLeft"],
        composition: [
          "city.bridge.pillar",
          {
            attributes: { scale: 1.1 },
            spriteAttributes: {
              lightness: 0.6
            }
          }
        ],
        distance: 1.1
      },
      {
        x: 920,
        y: -590,
        z: 300,
        components: ["PillarRight"],
        composition: [
          "city.bridge.pillar",
          {
            attributes: { scale: 1.1 },
            spriteAttributes: {
              lightness: 0.6,
              flipX: true
            }
          }
        ],
        distance: 1.1
      },
      {
        x: 0,
        y: -610,
        z: -40,
        components: ["SunBlock", "BridgeCeiling", "ShipSolid"],
        composition: [
          "city.bridge.deck",
          {
            spriteAttributes: {
              accentColor: "#2ba04c"
            }
          }
        ],
        distance: 1.0
      },
      {
        x: 0,
        y: -470,
        z: -42,
        components: ["SunBlock", "BridgeCeilingBackground"],
        composition: [
          "city.bridge.deck",
          {
            attributes: { scale: 0.9 },
            spriteAttributes: {
              accentColor: "#b15a5a"
            }
          }
        ],
        distance: 0.9
      },
      {
        x: 0,
        y: -345,
        z: -44,
        components: ["SunBlock"],
        composition: [
          "city.bridge.deck",
          {
            attributes: { scale: 0.8 },
            spriteAttributes: {
              accentColor: "#2ba04c"
            }
          }
        ],
        distance: 0.8
      },
      {
        x: 0,
        y: -240,
        z: -46,
        composition: [
          "city.bridge.deck",
          {
            attributes: { scale: 0.7 },
            spriteAttributes: {
              accentColor: "#b15a5a",
              horizon: [0.2, 0.2]
            }
          }
        ],
        distance: 0.7
      },
      {
        x: 20,
        y: -190,
        z: -47,
        composition: [
          "city.bridge.pillar",
          {
            attributes: { scale: 0.5 },
            spriteAttributes: {
              horizon: [0.2, 0.2]
            }
          }
        ],
        distance: 0.7
      },
      {
        x: 600,
        y: -190,
        z: -46,
        composition: [
          "city.bridge.pillar",
          {
            attributes: { scale: 0.5 },
            spriteAttributes: {
              horizon: [0.2, 0.2],
              flipX: true
            }
          }
        ],
        distance: 0.7
      },
      {
        x: 0,
        y: -160,
        z: -48,
        composition: [
          "city.bridge.deck",
          {
            attributes: { scale: 0.62 },
            spriteAttributes: {
              accentColor: "#2ba04c",
              horizon: [0.3, 0.3]
            }
          }
        ],
        distance: 0.62
      },
      {
        x: 0,
        y: -90,
        z: -50,
        composition: [
          "city.bridge.deck",
          {
            attributes: { scale: 0.55 },
            spriteAttributes: {
              accentColor: "#b15a5a",
              horizon: [0.3, 0.3]
            }
          }
        ],
        distance: 0.55
      },
      {
        x: 0,
        y: -40,
        z: -52,
        composition: [
          "city.bridge.deck",
          {
            attributes: { scale: 0.5 },
            spriteAttributes: {
              accentColor: "#2ba04c",
              horizon: [0.4, 0.4]
            }
          }
        ],
        distance: 0.5
      }
    ]
  }
};
