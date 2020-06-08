import ShipControls from "src/components/player/ShipControls";
import ShipCollision from "src/components/player/ShipCollision";
import ControlScheme from "src/components/player/ControlScheme";

export const playerShip = ({
  existing = false,
  hasLaser = false,
  turned = false
} = {}) => async ({
  spawn,
  exec,
  waitForEvent,
  allowDamage,
  setHealthbar,
  showState,
  wait,
  loseLife
}) => {
  const maxHealth = 50;
  const player = Crafty("Player").get(0);
  const existingShip = existing && Crafty("PlayerShip").get(0);
  const ship =
    existingShip ||
    spawn("PlayerShip", {
      location: {
        rx: turned ? 0.8 : 0.2,
        ry: 0.5
      },
      defaultVelocity: 400
    });
  if (!player.invincible) {
    if (ship === existingShip) {
      await allowDamage(ship, {
        health: ship.health || maxHealth
      });
    } else {
      ship.health = ship.health || maxHealth;
      wait(2000).then(async () => {
        await allowDamage(ship, {});
      });
    }
  }
  if (hasLaser) ship.hasLaser = true;
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

  ship.uniqueBind("HealthChange", newHealth => {
    setHealthbar(newHealth / 50);
    if (newHealth < maxHealth * 0.5) {
      ship.displayFrame("damaged");
    }
  });

  ship.uniqueBind("turn", () => {
    if (ship.health < maxHealth * 0.5) {
      showState(ship, "turningDamaged");
    } else {
      showState(ship, "turning");
    }
  });

  if (player.has(ControlScheme)) {
    player.assignControls(ship);
  }

  waitForEvent(ship, "Dead", async () => {
    ship.attr({ disableControls: true, vx: 0, vy: 0 });
    await showState(ship, "dead");
    const isTurned = !!ship.xFlipped;
    const hasLaser = ship.hasLaser;
    ship.destroy();
    await loseLife();
    exec(playerShip({ turned: isTurned, hasLaser }));
  });
};
