import ControlScheme from "src/components/player/ControlScheme";
import Player from "src/components/player/Player";
import PlayerSpaceship from "src/components/player/PlayerSpaceship";

const shipFunctions = () => ({
  spawnShip: () => {
    Crafty(Player).each(function() {
      this.addComponent("ShipSpawnable");
      this.spawnPosition(() => ({
        x: 200,
        y: 100
      }));
    });
    Crafty([Player, ControlScheme].join(" ")).each(function() {
      this.attr({ shipType: PlayerSpaceship });
      this.spawnShip();
    });
  }
});

export default shipFunctions;
