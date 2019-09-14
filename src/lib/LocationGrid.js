import defaults from "lodash/defaults";
import shuffle from "lodash/shuffle";

class LocationGrid {
  constructor(config) {
    const settings = defaults({}, config, {
      x: {},
      y: {},
      initial: []
    });

    settings.x = defaults(settings.x, {
      start: 0,
      steps: 0,
      stepSize: 1,
      avoid: []
    });

    settings.y = defaults(settings.y, {
      start: 0,
      steps: 0,
      stepSize: 1,
      avoid: []
    });

    const xs = this.coordList(settings.x);
    const ys = this.coordList(settings.y);
    const coords = ys.reduce(
      (acc, y) => acc.concat(xs.map(x => ({ x, y }))),
      settings.initial
    );

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
