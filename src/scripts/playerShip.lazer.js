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
  setEnergybar,
  showState,
  setGameSpeed,
  addScreenTrauma,
  playerHit,
  wait,
  loseLife
}) => {
  const maxHealth = 50;

  let maxEnergy = 50;

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
        health: ship.health || maxHealth,
        energy: 0
      });
      ship.unbind("HealthChange");
      ship.unbind("DealtDamage");
      ship.unbind("Turn");
      ship.unbind("Dead");
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
  setEnergybar(ship.energy / maxEnergy);
  if (turned) {
    await showState(ship, "turned");
  }
  showState(ship, "flying");

  // TODO: Refactor adding these components to the entity definition
  ship.addComponent(ShipControls, ShipCollision);

  ship.uniqueBind("DealtDamage", ({ damage, target }) => {
    if (damage[0].name === "Bullet") {
      ship.energy = Math.min(maxEnergy, ship.energy + 5);
      setEnergybar(ship.energy / maxEnergy);
    }
  });
  ship.uniqueBind("HealthChange", newHealth => {
    if (newHealth < ship.health) {
      playerHit(newHealth - ship.health);
    }
    try {
      setHealthbar(newHealth / maxHealth);
    } catch (e) {
      // player could be game over
    }

    if (newHealth < maxHealth * 0.5) {
      if (ship.appliedEntityState !== "dead") {
        ship.displayFrame("damaged");
      }
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
    addScreenTrauma(0.8);
    setGameSpeed(0.4);
    const state = showState(ship, "dead");
    await wait(150);
    setGameSpeed(0.7);
    await wait(600);
    addScreenTrauma(0.5);
    await state;
    const isTurned = !!ship.xFlipped;
    const hasLaser = ship.hasLaser;
    ship.destroy();
    await loseLife();
    setGameSpeed(1.0);
    await wait(1000);
    exec(playerShip({ turned: isTurned, hasLaser }));
  });
};
