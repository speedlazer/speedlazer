import { say } from "src/lib/Dialog";

export const largeDrone = () => async ({
  moveWithPattern,
  playAnimation,
  setScrollingSpeed,
  showState,
  until,
  spawn,
  parallel,
  wait
}) => {
  const drone = spawn("LargeDrone", {
    location: {
      rx: 1.1,
      ry: 0.2
    },
    defaultVelocity: 200
  });
  let movement = moveWithPattern(drone, "largeDrone.intro");
  await movement.process;
  await parallel([
    () =>
      say(
        "Drone",
        "**Bzzt** We are in control of your army now!\nJust give up!",
        {
          portrait: "portraits.drone"
        }
      ),
    () => showState(drone, "laugh")
  ]);

  await until(
    () => showState(drone, "shootRockets"),
    () => {
      movement = moveWithPattern(drone, "largeDrone.eight");
      return movement.process;
    }
  );

  console.log("mine attack!");

  await wait(10e3);
  const bridgeCrash = playAnimation("City.Bridge", { max: 2 });
  await wait(10e3);

  bridgeCrash.updateCheckpointLimit(Infinity);
  await bridgeCrash.waitTillCheckpoint(3);
  await setScrollingSpeed(200, 0);

  drone.destroy();
};
