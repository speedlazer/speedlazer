import { EASE_OUT, EASE_IN } from "src/constants/easing";
import { droneWave } from "./drones.lazer";

export const droneShip = () => async ({
  spawn,
  waitForEvent,
  until,
  parallel,
  wait,
  showState,
  allowDamage,
  moveTo
}) => {
  let activeMovement = null;
  const ship = spawn("DroneShip", {
    location: {
      rx: 1.1,
      ry: 0.7
    },
    defaultVelocity: 120
  });
  showState(ship, "activateGun");
  ship.gun
    .addCollisionComponent("SolidCollision")
    .addCollisionComponent("PlayerEnemy");
  await allowDamage(ship.gun, { health: 750 });

  const gun = waitForEvent(ship.gun, "Dead", async () => {
    showState(ship.gun, "dead");
    ship.gun.clearCollisionComponents();
  });
  activeMovement = moveTo(ship, { x: 0.5 }, null, EASE_OUT);
  await activeMovement.process;
  activeMovement = moveTo(ship, { x: -0.8 }, null, EASE_IN);
  activeMovement.process.then(() => ship.destroy());

  showState(ship, "radarPulse");
  ship.radar.addCollisionComponent("SolidCollision");
  await allowDamage(ship.radar, { health: 300 });

  await parallel([
    () =>
      until(
        () =>
          waitForEvent(ship.radar, "Dead", async () => {
            showState(ship.radar, "dead");
            ship.radar.clearCollisionComponents();
          }),
        async ({ exec }) => {
          exec(droneWave(2, "drone.pattern2", 500));
          await wait(1500);
        }
      ),
    () => gun
  ]);
};
