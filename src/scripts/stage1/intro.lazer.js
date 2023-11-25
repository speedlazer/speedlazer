import { droneWave } from "./enemies/drones.lazer";
import { backgroundHeli, heliAttack } from "./animations/backgroundHeli.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "../../components/BigText";
import audio from "../../lib/audio";
import { say } from "../../lib/Dialog";
import { checkpoint } from "../common.lazer";
import Crafty from "../../crafty";

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

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  playAnimation,
  setAltitude,
  showHUD,
  parallel,
  exec,
  onScriptClose,
  fadeIn,
  wait
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);
  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects", "hero"]);
  audio.playAudio("hero");
  const heliAudio = audio.playAudio("helicopter", { volume: 0 });
  onScriptClose(() => {
    heliAudio.stop();
  });
  await setScrollingSpeed(150, 0, { instant: true });
  await setScenery("city.Ocean");
  setBackground("city.Sunrise", 0, 2);
  const fade = fadeIn();
  text.remove();

  const introAnimation = playAnimation("city.Intro");
  const introShip = Crafty("IntroShip").get(0);
  exec(handleBox(introShip.boxLocation1));
  exec(handleBox(introShip.boxLocation2));

  await fade.start(1000);

  await parallel([
    () =>
      say(
        "General",
        "Let us escort you to the factory to install\n" +
          "the AI controlled defence systems. You are the last ship.",
        { portrait: "portraits.general" }
      ),
    async () => {
      await introAnimation.waitTillCheckpoint(1);
      heliAudio.setVolume(2.0, 1500);
    },
    async () => {
      await introAnimation.waitTillCheckpoint(3);
      heliAudio.setVolume(0.6, 3000);
      exec(playerShip({ existing: true }));
    }
  ]);

  showHUD();
  const ready = bigText("Get ready", { color: "#FF0000" });
  const blink = ready.blink(200, 4);

  let helicopter;

  setScrollingSpeed(350, 0);
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
          await parallel([
            () =>
              exec(
                droneWave(2, "drone.straight", { delay: 300, yOffset: 0.1 })
              ),
            async () => {
              await wait(1500);
              await exec(
                droneWave(2, "drone.straight", { delay: 300, yOffset: -0.1 })
              );
            },
            async () => {
              await wait(3000);
              await exec(
                droneWave(2, "drone.straight", { delay: 300, yOffset: -0.3 })
              );
            }
          ]);
          await exec(droneWave(5, "drone.pattern1"));
          await exec(droneWave(8, "drone.pattern2"));
        }
      ]);
    }
  ]);
  introAnimation.destroy();
  setAltitude(200);
  await exec(droneWave(5, "drone.pattern1"));
  await exec(droneWave(8, "drone.pattern2"));
  await say("John", "Well that was fun. I will miss the manual mode..", {
    portrait: "portraits.pilot"
  });
  await helicopter;
  exec(heliAttack({ existing: true }, heliAudio));
  await say("General", "What is that! Evacuate!\nNow!", {
    portrait: "portraits.general"
  });
  await wait(1000);
  const chapter1 = bigText("Hacked", { color: "#FFFFFF", sup: "Chapter 1:" });
  await parallel([
    () =>
      say("General", "The helicopter is out of control!", {
        portrait: "portraits.general"
      }),
    async () => {
      await wait(2000);
      await chapter1.fadeIn(500);
      await wait(2000);
      await chapter1.fadeOut(500);
    }
  ]);
  chapter1.remove();
  await parallel([
    () => exec(droneWave(5, "drone.pattern3")),
    () => exec(droneWave(5, "drone.pattern4"))
  ]);
  await exec(checkpoint);
};

export default part;
