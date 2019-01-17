import battleShip from "./BattleShip.composition.json";
import droneShip from "./DroneShip.composition.json";
import introShip from "./IntroShip.composition.json";
import shipHatch from "./ShipHatch.composition.json";
import bulletCannon from "./BulletCannon.composition.json";

const compositions = {
  ...battleShip,
  ...droneShip,
  ...introShip,
  ...shipHatch,
  ...bulletCannon
};

export default compositions;
