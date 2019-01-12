import battleShip from "./BattleShip.composition.json";
import droneShip from "./DroneShip.composition.json";
import introShip from "./IntroShip.composition.json";
import shipHatch from "./ShipHatch.composition.json";

const compositions = {
  ...battleShip,
  ...droneShip,
  ...introShip,
  ...shipHatch
};

export default compositions;
