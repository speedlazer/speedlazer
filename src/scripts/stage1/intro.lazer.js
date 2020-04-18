import { droneWave } from "./enemies/drones.lazer";
import { backgroundHeli, heliAttack } from "./animations/backgroundHeli.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";
import { say } from "src/lib/Dialog";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  setBackgroundCheckpointLimit,
  playAnimation,
  setAltitude,
  showHUD,
  parallel,
  exec,
  wait
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);
  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["laser-shot", "laser-hit", "explosion", "hero"]);
  playAudio("hero");
  await setScrollingSpeed(100, 0, { instant: true });
  await setScenery("City.Ocean");
  setBackground("City.Sunrise");
  setBackgroundCheckpointLimit(2);
  text.remove();

  const introAnimation = playAnimation("City.Intro");
  await Promise.all([
    introAnimation.waitTillCheckpoint(3),
    (async () => {
      await wait(1500);
      await say(
        "General",
        "Let us escort you to the factory to install\n" +
          "the AI controlled defence systems. You are the last ship.",
        { portrait: "portraits.general" }
      );
    })()
  ]);
  showHUD();
  const ready = bigText("Get ready", { color: "#FF0000" });
  const blink = ready.blink(200, 4);

  exec(playerShip({ existing: true }));

  let helicopter;

  await setScrollingSpeed(250, 0);
  await parallel([
    async () => {
      await introAnimation.waitTillEnd();
    },
    async () => {
      await blink;
      await ready.zoomOut(500);
      ready.remove();
      helicopter = exec(backgroundHeli({ existing: true }));
      await parallel([
        async () => {
          await say(
            "General",
            "We send some drones for some last manual target practice",
            { portrait: "portraits.general" }
          );
          await say("John", "Let's go!", { portrait: "portraits.pilot" });
        },
        async () => {
          await exec(droneWave(5, "drone.pattern1", 500));
          await exec(droneWave(8, "drone.pattern2", 500));
        }
      ]);
    }
  ]);
  introAnimation.destroy();
  setAltitude(200);
  await exec(droneWave(5, "drone.pattern1", 500));
  await exec(droneWave(8, "drone.pattern2", 500));
  await say("John", "Well that was fun. I will miss the manual mode..", {
    portrait: "portraits.pilot"
  });
  await helicopter;
  exec(heliAttack({ existing: true }));
  await say("General", "What is that!", { portrait: "portraits.general" });
  await say("General", "Evacuate! now!", { portrait: "portraits.general" });
  await wait(1000);
  await say("General", "The helicopter is out of control!", {
    portrait: "portraits.general"
  });
  await wait(2000);
  const chapter1 = bigText("Hacked", { color: "#FFFFFF", sup: "Chapter 1:" });
  await chapter1.fadeIn(500);
  await wait(2000);
  await chapter1.fadeOut(500);
  chapter1.remove();
  await parallel([
    () => exec(droneWave(5, "drone.pattern3", 500)),
    () => exec(droneWave(5, "drone.pattern4", 500))
  ]);
  await parallel([
    () => exec(droneWave(5, "drone.pattern3", 500)),
    () => exec(droneWave(5, "drone.pattern4", 500))
  ]);
};

export default part;
