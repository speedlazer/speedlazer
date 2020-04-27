import ShipControls from "src/components/player/ShipControls";
import ShipCollision from "src/components/player/ShipCollision";
import ControlScheme from "src/components/player/ControlScheme";

export const playerShip = ({ existing = false } = {}) => async ({
  spawn,
  exec,
  waitForEvent,
  allowDamage,
  showState,
  loseLife
}) => {
  const player = Crafty("Player").get(0);
  const ship =
    (existing && Crafty("PlayerShip").get(0)) ||
    spawn("PlayerShip", {
      location: {
        rx: 0.2,
        ry: 0.5
      },
      defaultVelocity: 400
    });
  if (!player.invincible) {
    await allowDamage(ship, { health: 50 });
  }
  showState(ship, "flying");

  // TODO: Refactor adding these components to the entity definition
  ship.addComponent(ShipControls, ShipCollision);

  if (player.has(ControlScheme)) {
    player.assignControls(ship);
  }

  waitForEvent(ship, "Dead", async () => {
    ship.attr({ disableControls: true, vx: 0, vy: 0 });
    await showState(ship, "dead");
    ship.destroy();
    await loseLife();
    exec(playerShip());
  });
};
