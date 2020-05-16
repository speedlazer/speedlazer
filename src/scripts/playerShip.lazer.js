import ShipControls from "src/components/player/ShipControls";
import ShipCollision from "src/components/player/ShipCollision";
import ControlScheme from "src/components/player/ControlScheme";

export const playerShip = ({
  existing = false,
  turned = false
} = {}) => async ({
  spawn,
  exec,
  waitForEvent,
  allowDamage,
  setHealthbar,
  showState,
  loseLife
}) => {
  const maxHealth = 50;
  const player = Crafty("Player").get(0);
  const ship =
    (existing && Crafty("PlayerShip").get(0)) ||
    spawn("PlayerShip", {
      location: {
        rx: turned ? 0.8 : 0.2,
        ry: 0.5
      },
      defaultVelocity: 400
    });
  if (!player.invincible) {
    await allowDamage(ship, {
      health: ship.health || maxHealth
    });
  }
  if (ship.health < maxHealth * 0.5) {
    ship.displayFrame("damaged");
  }
  setHealthbar(ship.health / maxHealth);
  if (turned) {
    await showState(ship, "turned");
  }
  showState(ship, "flying");

  // TODO: Refactor adding these components to the entity definition
  ship.addComponent(ShipControls, ShipCollision);
  ship.bind("HealthChange", newHealth => {
    setHealthbar(newHealth / 50);
    if (newHealth < maxHealth * 0.5) {
      ship.displayFrame("damaged");
    }
  });

  if (player.has(ControlScheme)) {
    player.assignControls(ship);
  }

  waitForEvent(ship, "Dead", async () => {
    ship.attr({ disableControls: true, vx: 0, vy: 0 });
    await showState(ship, "dead");
    const isTurned = !!ship.xFlipped;
    ship.destroy();
    await loseLife();
    exec(playerShip({ turned: isTurned }));
  });
};
