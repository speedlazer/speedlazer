//import { getOne, pickOne } from "src/lib/utils";
//import { EASE_IN_OUT } from "src/constants/easing";

export const droneWave1 = async ({
  spawn,
  //wait,
  //until,
  call,
  //displayFrame,
  waitWhile,
  moveWithPattern
}) => {
  // spawn dronw off screen
  const drone = spawn("WarDrone", {
    location: {
      rx: 1.1,
      ry: 0.5
    },
    defaultVelocity: 200
  });

  await call(drone.allowDamage, { health: 400 });
  const movement = moveWithPattern(drone, "pattern1");

  const healthCheck = async () => {
    await waitWhile(drone.hasHealth);
    movement.abort();
    await call(drone.showState, "damaged");
    await call(drone.activateGravity);
  };

  await Promise.race([movement.process, healthCheck()]);

  console.log("Done!");
};
