import { droneWave } from "./enemies/drones.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "../../components/BigText";
import audio from "../../lib/audio";
import { say } from "../../lib/Dialog";
import { checkpoint } from "../common.lazer";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  parallel,
  setBackground,
  wait,
  exec,
  showHUD
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects", "hero"]);
  audio.playAudio("hero");

  await setScrollingSpeed(150, 0, { instant: true });
  await setScenery("city.Coast");
  setBackground("city.Sunrise", 3, 3);
  showHUD();
  text.remove();
  exec(playerShip({ existing: true, hasLaser: true }));

  await setScrollingSpeed(350, 0);
  await setScenery("city.BayStart");
  await say(
    "General",
    "I'm at a safe location now. We need to end this threat.\nHow are you holding up?",
    { portrait: "portraits.general" }
  );
  await parallel([
    async () => {
      await say(
        "John",
        "I'm fine. That ship had some advanced weaponry on board.\n" +
          "Did you know that?",
        {
          portrait: "portraits.pilot"
        }
      );
      await say(
        "General",
        "We can not acces the computer systems anymore. But this would\n" +
          "mean they also have control over our R&D division.\nThis is really bad.",
        { portrait: "portraits.general" }
      );
      await say("John", "I will try to reach the R&D center to investigate.", {
        portrait: "portraits.pilot"
      });
    },
    () =>
      exec(
        droneWave(4, "drone.straight", { delay: 400, yOffset: 0.1, speed: 330 })
      ),
    async () => {
      await wait(4000);
      await exec(
        droneWave(4, "drone.straight", {
          delay: 400,
          yOffset: -0.1,
          speed: 330
        })
      );
    },
    async () => {
      await wait(8000);
      await exec(
        droneWave(4, "drone.straight", {
          delay: 400,
          yOffset: -0.3,
          speed: 330
        })
      );
    },
    async () => {
      await wait(10000);
      await exec(
        droneWave(4, "drone.straight", {
          delay: 400,
          yOffset: -0.1,
          speed: 330
        })
      );
    },
    async () => {
      await wait(12000);
      await exec(
        droneWave(4, "drone.straight", {
          delay: 400,
          yOffset: 0.1,
          speed: 330
        })
      );
    }
  ]);
  await exec(checkpoint);
};

export default part;
