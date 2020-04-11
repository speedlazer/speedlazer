import backgrounds from "./backgrounds.composition.json";
import battleShip from "./BattleShip.composition.json";
import bulletCannon from "./BulletCannon.composition.json";
import dino from "./Dino.composition.json";
import bullets from "./bullets.composition.json";
import drone from "./Drone.composition.json";
import droneBoss from "./DroneBoss.composition.json";
import droneShip from "./DroneShip.composition.json";
import introShip from "./IntroShip.composition.json";
import ocean from "./Ocean.composition.json";
import city from "./City.composition.json";
import shipHatch from "./ShipHatch.composition.json";
import portraits from "./portraits.composition.json";
import playerShip from "./PlayerShip.composition.json";
import mine from "./Mine.composition.json";
import helicopter from "./Helicopter.composition.json";

const compositions = {
  ...backgrounds,
  ...battleShip,
  ...bulletCannon,
  ...city,
  ...dino,
  ...drone,
  ...droneBoss,
  ...droneShip,
  ...introShip,
  ...ocean,
  ...shipHatch,
  ...portraits,
  ...bullets,
  ...playerShip,
  ...mine,
  ...helicopter
};

export default compositions;
