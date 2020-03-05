import ShipControls from "src/components/player/ShipControls";
import ShipCollision from "src/components/player/ShipCollision";
import ControlScheme from "src/components/player/ControlScheme";

export const playerShip = ({ existing = false }) => async ({
  spawn,
  call,
  waitForEvent
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

  const healthCheck = async () => {
    await waitForEvent(ship, "Dead");
    await call(ship.showState, "dead");
  };
  healthCheck();
};
