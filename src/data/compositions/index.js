import backgrounds from "./backgrounds.composition";
import battleShip from "./BattleShip.composition.js";
import bulletCannon from "./BulletCannon.composition";
import dino from "./Dino.composition.json";
import bullets from "./bullets.composition.json";
import drone from "./Drone.composition.json";
import droneBoss from "./DroneBoss.composition.json";
import droneShip from "./DroneShip.composition.js";
import introShip from "./IntroShip.composition.js";
import ocean from "./Ocean.composition.json";
import city from "./City.composition.json";
import shipHatch from "./ShipHatch.composition.js";
import portraits from "./portraits.composition.json";
import playerShip from "./PlayerShip.composition.json";
import mine from "./Mine.composition.json";
import helicopter from "./Helicopter.composition";

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
