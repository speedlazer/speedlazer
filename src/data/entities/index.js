import sun from "./Sun.entity.json";
import battleShip from "./BattleShip.entity.json";
import droneShip from "./DroneShip.entity";
import introShip from "./IntroShip.entity.json";
import playerShip from "./PlayerShip.entity.json";
import drone from "./Drone.entity.json";
import mine from "./Mine.entity.json";
import weapons from "./Weapons.entity.json";
import helicopter from "./Helicopter.entity.json";
import largeDrone from "./LargeDrone.entity.json";

export default {
  ...playerShip,
  ...battleShip,
  ...droneShip,
  ...introShip,
  ...drone,
  ...largeDrone,
  ...sun,
  ...weapons,
  ...mine,
  ...helicopter
};
