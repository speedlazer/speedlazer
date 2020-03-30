import { droneWave } from "./enemies/drones.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";
import { say } from "src/lib/Dialog";

const parallel = list => Promise.all(list.map(l => l()));

const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  setBackgroundCheckpointLimit,
  playAnimation,
  showHUD,
  exec,
  wait
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["laser-shot", "laser-hit", "explosion", "hero"]);
  playAudio("hero");

  await setScrollingSpeed(100, 0);
  await setScenery("City.Ocean");
  setBackground("City.Sunrise");
  text.remove();
  const introAnimation = playAnimation("City.Intro");
  await Promise.all([
    introAnimation.waitTillCheckpoint(3),
    (async () => {
      await wait(1000);
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
  setBackgroundCheckpointLimit(4);

  await setScrollingSpeed(250, 0);
  await parallel([
    async () => {
      await introAnimation.waitTillEnd();
    },
    async () => {
      await blink;
      await ready.zoomOut(500);
      ready.remove();
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
          await exec(droneWave(5, "pattern1", 500));
          await exec(droneWave(8, "pattern2", 500));
        }
      ]);
    }
  ]);
  introAnimation.destroy();
  await exec(droneWave(5, "pattern1", 500));
};

export default stage1;
