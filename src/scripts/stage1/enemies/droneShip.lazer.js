import { EASE_OUT, EASE_IN } from "src/constants/easing";
import { droneWave } from "./drones.lazer";

export const droneShip = () => async ({
  spawn,
  call,
  waitForEvent,
  until,
  parallel,
  wait,
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
  call(ship.showState, "activateGun");
  ship.gun
    .addComponent("SolidCollision")
    .addComponent("DamageSupport")
    .addComponent("PlayerEnemy");
  await call(ship.gun.allowDamage, { health: 750 });

  const gun = waitForEvent(ship.gun, "Dead", async () => {
    call(ship.gun.showState, "dead");
  });
  activeMovement = moveTo(ship, { x: 0.5 }, null, EASE_OUT);
  await activeMovement.process;
  activeMovement = moveTo(ship, { x: -0.8 }, null, EASE_IN);
  activeMovement.process.then(() => ship.destroy());

  call(ship.showState, "radarPulse");
  ship.radar.addComponent("SolidCollision").addComponent("DamageSupport");
  await call(ship.radar.allowDamage, { health: 300 });

  await parallel([
    () =>
      until(
        () =>
          waitForEvent(ship.radar, "Dead", async () => {
            call(ship.radar.showState, "dead");
          }),
        async ({ exec }) => {
          exec(droneWave(2, "drone.pattern2", 500));
          await wait(1500);
        }
      ),
    () => gun
  ]);
};
