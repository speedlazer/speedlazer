import { LazerScript } from "src/lib/LazerScript";
import { Morning } from "./stage1/sunrise";
import "src/components/entities/DroneShip";
import bossShip from "./stage1/ship_boss";

class Test extends LazerScript {
  assets() {
    return this.loadAssets("playerShip");
  }

  execute() {
    this.inventoryAdd("weapon", "lasers", { marking: "L" });
    this.inventoryAdd("ship", "points", { marking: "P", icon: "star" });
    Crafty.e("DebugInfo");

    return this.sequence(
      //@setShipType('PlayerControlledCube')

      this.setWeapons(["lasers"]),
      this.setSpeed(300),
      this.setScenery("City.Ocean"),
      this.async(this.runScript(Morning, { speed: 1 })),
      this.placeSquad(bossShip)
    );
  }
}

export default Test;
