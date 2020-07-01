export default {
  "city.Bridge": {
    width: 1023,
    height: 576,
    left: "city.Bay",
    right: "city.BayFull",
    backgrounds: [["city.Sunrise", 3]],
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
        y: -710,
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
        z: 299,
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
        z: 299,
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
        y: -580,
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
        y: -460,
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
