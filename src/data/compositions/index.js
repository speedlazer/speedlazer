import battleShip from "./BattleShip.composition.json";
import droneShip from "./DroneShip.composition.json";
import introShip from "./IntroShip.composition.json";

const compositions = {
  ...battleShip,
  ...droneShip,
  ...introShip
};

export default compositions;
