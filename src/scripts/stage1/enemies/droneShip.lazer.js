import { EASE_OUT, EASE_IN_OUT } from "src/constants/easing";

export const droneShip = () => async ({
  spawn,
  call,
  waitForEvent,
  wait,
  moveWithPattern,
  moveTo
}) => {
  let activeMovement = null;
  const ship = spawn("DroneShip", {
    location: {
      rx: 1.1,
      ry: 0.7
    },
    defaultVelocity: 100
  });
  activeMovement = moveTo(ship, { x: 0.5 }, null, EASE_OUT);
  await activeMovement.process;
};
