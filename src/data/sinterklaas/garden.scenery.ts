import type { SceneryCollection } from "../types";

export const sceneries: SceneryCollection = {
  "garden.Grass": {
    width: 1023,
    height: 576,
    left: "garden.Grass",
    right: "garden.Grass",
    backgrounds: [["city.Sunrise", 4]],
    altitudes: [0, 250, 400, 700],
    elements: [
      {
        x: 0,
        y: -65,
        composition: "grass.front",
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid"],
        w: 1024,
        h: 45,
      },
      {
        x: 0,
        y: -50,
        composition: "grass.middle",
        distance: 0.75,
      },
      {
        x: 0,
        y: -100,
        composition: "grass.hedge",
        distance: 0.65,
      },
      {
        x: 0,
        y: 65,
        z: -80,
        composition: "hills.horizon",
        distance: 0.1875,
      },
    ],
  },
  "garden.PondStart": {
    width: 1023,
    height: 576,
    left: "garden.Grass",
    right: "garden.Pond",
    backgrounds: [["city.Sunrise", 4]],
    altitudes: [0, 250, 400, 700],
    elements: [
      {
        x: 0,
        y: -65,
        composition: "grass.front",
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid"],
        w: 1024,
        h: 45,
      },
      {
        x: 0,
        y: -50,
        composition: "grass.pondStart",
        distance: 0.75,
      },
      {
        x: 0,
        y: -100,
        composition: "grass.hedge",
        distance: 0.65,
      },
      {
        x: 0,
        y: 65,
        z: -80,
        composition: "hills.horizon",
        distance: 0.1875,
      },
    ],
  },
  "garden.Pond": {
    width: 1023,
    height: 576,
    right: "garden.Pond",
    left: "garden.Pond",
    backgrounds: [["city.Sunrise", 4]],
    altitudes: [0, 250, 400, 700],
    elements: [
      {
        x: 0,
        y: -65,
        composition: "grass.front",
      },
      {
        x: 0,
        y: -45,
        components: ["ShipSolid", "BulletSolid"],
        w: 1024,
        h: 45,
      },
      {
        x: 0,
        y: -50,
        composition: "grass.pond",
        distance: 0.75,
      },
      {
        x: 0,
        y: -100,
        composition: "grass.hedge",
        distance: 0.65,
      },
      {
        x: 0,
        y: -165,
        z: -30,
        composition: "town.middle",
        distance: 0.5,
      },
      {
        x: 0,
        y: 35,
        z: -70,
        composition: "town.skyline",
        distance: 0.25,
      },
      {
        x: 0,
        y: 65,
        z: -80,
        composition: "hills.horizon",
        distance: 0.1875,
      },
    ],
  },
};
export default sceneries;
