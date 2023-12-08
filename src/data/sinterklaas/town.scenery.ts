import type { SceneryCollection } from "../types";

const sceneries: SceneryCollection = {
  "town.RoofTops": {
    width: 1023,
    height: 576,
    left: "town.RoofTops",
    right: "town.RoofTops",
    backgrounds: [["city.Sunset", 1]],
    altitudes: [0, 250, 400, 700],
    elements: [
      {
        x: 0,
        y: -165,
        z: -30,
        composition: "town.middleFull",
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
  "town.Rasberg": {
    width: 1023,
    height: 576,
    left: "town.RoofTops",
    right: "city.BayFull",
    backgrounds: [["city.Sunset", 2]],
    altitudes: [0, 250, 400, 700],
    elements: [
      {
        x: -800,
        y: -865,
        z: 300,
        composition: "city.skyScraper",
        distance: 1.0,
      },
      {
        x: -300,
        y: -1100,
        z: -200,
        composition: "city.skyScraper",
        distance: 0.7,
      },
      {
        x: -1700,
        y: -1300,
        z: 150,
        composition: "city.skyScraper",
        distance: 1.1,
      },
      {
        x: 0,
        y: -165,
        z: -30,
        composition: "town.middleFull",
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
