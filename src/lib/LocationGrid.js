import defaults from "lodash/defaults";
import shuffle from "lodash/shuffle";

class LocationGrid {
  constructor(settings) {
    settings = defaults(settings, {
      x: {},
      y: {}
    });

    settings.x = defaults(settings.x, {
      start: 0,
      steps: 1,
      stepSize: 1,
      avoid: []
    });

    settings.y = defaults(settings.y, {
      start: 0,
      steps: 1,
      stepSize: 1,
      avoid: []
    });

    const xs = this.coordList(settings.x);
    const ys = this.coordList(settings.y);
    const coords = [];
    for (let y of ys) {
      for (let x of xs) {
        const xPerc =
          (x - settings.x.start) / (settings.x.stepSize * settings.x.steps);
        const yPerc =
          (y - settings.y.start) / (settings.y.stepSize * settings.y.steps);
        coords.push({ x, y, xPerc, yPerc });
      }
    }

    this.freeCoords = shuffle(coords);
  }

  coordList(listSettings) {
    const avoid =
      typeof listSettings.avoid === "function"
        ? listSettings.avoid()
        : listSettings.avoid;
    const start =
      typeof listSettings.start === "function"
        ? listSettings.start()
        : listSettings.start;
    return Array(listSettings.steps)
      .fill()
      .map((v, i) => start + i * listSettings.stepSize)
      .filter((v, i) => !avoid.includes(i));
  }

  getLocation() {
    return this.freeCoords.pop();
  }
}

export default LocationGrid;
