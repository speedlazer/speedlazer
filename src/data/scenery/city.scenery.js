export default {
  "city.CoastWithCloud": {
    width: 1023,
    height: 576,
    right: "city.Coast",
    left: "city.Coast",
    backgrounds: [["city.Sunrise", 2]],
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
        y: -165,
        composition: "city.cloud",
        distance: 0.1,
        frame: "default"
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
  "city.CoastWithCloud2": {
    width: 1023,
    height: 576,
    right: "city.Coast",
    left: "city.Coast",
    backgrounds: [["city.Sunrise", 2]],
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
        y: -265,
        composition: "city.cloud",
        distance: 0.2,
        frame: "close"
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
  "city.Coast": {
    width: 1023,
    height: 576,
    right: {
      "city.CoastWithCloud": 0.1,
      "city.CoastWithCloud2": 0.1,
      "city.Coast": 0.8
    },
    left: {
      "city.CoastWithCloud": 0.1,
      "city.CoastWithCloud2": 0.1,
      "city.Coast": 0.8
    },
    backgrounds: [["city.Sunrise", 2]],
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
  "city.CoastStart": {
    width: 1023,
    height: 576,
    right: "city.Coast",
    left: "city.Ocean",
    backgrounds: [["city.Sunrise", 1]],
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
  "city.OceanWithCloud": {
    width: 1023,
    height: 576,
    right: "city.Ocean",
    left: "city.Ocean",
    backgrounds: [["city.Sunrise", 0]],
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
        y: -165,
        composition: "city.cloud",
        distance: 0.1,
        frame: "default"
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
  "city.OceanWithCloud2": {
    width: 1023,
    height: 576,
    right: "city.Ocean",
    left: "city.Ocean",
    backgrounds: [["city.Sunrise", 0]],
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
        y: -265,
        composition: "city.cloud",
        distance: 0.2,
        frame: "close"
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
  "city.Ocean": {
    width: 1023,
    height: 576,
    right: {
      "city.OceanWithCloud": 0.1,
      "city.OceanWithCloud2": 0.1,
      "city.Ocean": 0.8
    },
    left: {
      "city.OceanWithCloud": 0.1,
      "city.OceanWithCloud2": 0.1,
      "city.Ocean": 0.8
    },
    backgrounds: [["city.Sunrise", 0]],
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
  "city.BayStart": {
    width: 1023,
    height: 576,
    right: "city.Bay",
    left: "city.Coast",
    backgrounds: [["city.Sunrise", 2]],
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
  "city.Bay": {
    width: 1023,
    height: 576,
    left: "city.Bay",
    right: "city.Bay",
    backgrounds: [["city.Sunrise", 3]],
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
  "city.BayFull": {
    width: 1023,
    height: 576,
    left: "city.BayFull",
    right: "city.BayFull",
    backgrounds: [["city.Sunrise", 3]],
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
  }
};
