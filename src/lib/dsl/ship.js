import ControlScheme from "src/components/player/ControlScheme";
import Player from "src/components/player/Player";

const shipFunctions = () => ({
  spawnShip: (entityDef, options = { existing: false }) => {
    Crafty(Player).each(function() {
      this.addComponent("ShipSpawnable");
      this.spawnPosition(() => ({
        x: 200,
        y: 100
      }));
    });
    Crafty([Player, ControlScheme].join(" ")).each(function() {
      this.attr({ shipType: entityDef });
      const ship = this.spawnShip(options);
      ship.showState("flying");
      ship.one("Dead", () => {
        ship.showState("dead");
      });
    });
  }
});

export default shipFunctions;
