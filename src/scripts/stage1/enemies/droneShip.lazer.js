import { EASE_OUT, EASE_IN } from "src/constants/easing";
import { droneWave } from "./drones.lazer";

const handleBox = box => async ({
  showState,
  allowDamage,
  waitForEvent,
  call,
  awardPoints
}) => {
  await allowDamage(box, { health: 30 });
  waitForEvent(box, "Dead", async () => {
    awardPoints(25, box.x, box.y);
    showState(box, "falling");
    await call(box.activateGravity, "GravityLiquid");
  });
};

export const droneShip = () => async ({
  spawn,
  waitForEvent,
  until,
  parallel,
  wait,
  awardPoints,
  showState,
  allowDamage,
  exec,
  moveTo
}) => {
  let activeMovement = null;
  const ship = spawn("DroneShip", {
    location: {
      rx: 1.1,
      ry: 0.7
    },
    defaultVelocity: 150
  });
  exec(handleBox(ship.boxLocation1));
  showState(ship, "activateGun");
  ship.gun
    .addCollisionComponent("SolidCollision")
    .addCollisionComponent("PlayerEnemy");
  const gun = waitForEvent(ship.gun, "Dead", async () => {
    awardPoints(200, ship.gun.x + 20, ship.gun.y);
    showState(ship.gun, "dead");
    ship.gun.clearCollisionComponents();
  });
  await allowDamage(ship.gun, { health: 600 });

  activeMovement = moveTo(ship, { x: 0.5 }, null, EASE_OUT);
  ship.radar.addCollisionComponent("SolidCollision");
  let radarDestroyed = false;
  const radarKilled = waitForEvent(ship.radar, "Dead", async () => {
    radarDestroyed = true;
    awardPoints(100, ship.radar.x + 20, ship.radar.y);
    showState(ship.radar, "dead");
    ship.radar.clearCollisionComponents();
  });
  showState(ship, "radarPulse");
  await allowDamage(ship.radar, { health: 300 });
  await activeMovement.process;
  activeMovement = moveTo(ship, { x: -0.8 }, null, EASE_IN);
  activeMovement.process.then(() => ship.destroy());

  let points = 10;

  await parallel([
    () =>
      until(
        () => radarKilled,
        async ({ exec }) => {
          if (radarDestroyed) {
            await wait(1500);
            return;
          }
          exec(droneWave(2, "drone.pattern2", { points }));
          points = points > 0 ? points - 5 : 0;
          await wait(1500);
        }
      ),
    () => gun
  ]);
};
