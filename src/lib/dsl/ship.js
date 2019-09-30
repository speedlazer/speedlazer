import ControlScheme from "src/components/player/ControlScheme";
import Player from "src/components/player/Player";

const shipFunctions = () => ({
  setWeapons: async weapons => {
    Crafty("PlayerControlledShip").each(function() {
      this.clearItems();
      weapons.forEach(weapon => {
        this.installItem({ type: "weapon", contains: weapon });
      });
    });
    //level.setStartWeapons(weapons);
  },
  spawnShip: () => {
    Crafty(Player).each(function() {
      this.addComponent("ShipSpawnable");
      this.spawnPosition(() => ({
        x: 200,
        y: 100
      }));
    });
    Crafty([Player, ControlScheme].join(" ")).each(function() {
      this.attr({ shipType: "PlayerSpaceship" });
      this.spawnShip();
    });
  }
});

export default shipFunctions;
