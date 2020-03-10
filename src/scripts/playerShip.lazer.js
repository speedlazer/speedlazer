import ShipControls from "src/components/player/ShipControls";
import ShipCollision from "src/components/player/ShipCollision";
import ControlScheme from "src/components/player/ControlScheme";

export const playerShip = ({ existing = false } = {}) => async ({
  spawn,
  call,
  exec,
  waitForEvent,
  wait,
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
  await call(ship.allowDamage, { health: 50 });
  call(ship.showState, "flying");

  // TODO: Refactor adding these components to the entity definition
  ship.addComponent(ShipControls, ShipCollision);

  if (player.has(ControlScheme)) {
    player.assignControls(ship);
  }

  waitForEvent(ship, "Dead", async () => {
    ship.attr({ disableControls: true });
    await call(ship.showState, "dead");
    ship.destroy();
    await loseLife();
    await wait(1000);
    exec(playerShip());
  });
};
