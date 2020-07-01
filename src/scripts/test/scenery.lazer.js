import { droneWave } from "../stage1/enemies/drones.lazer";
import { mineWave } from "../stage1/enemies/mines.lazer";
import { bigText } from "src/components/BigText";
import { say } from "src/lib/Dialog";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  addScreenTrauma,
  setAltitude,
  exec,
  wait,
  fadeIn
}) => {
  const fade = fadeIn();
  const text = bigText("Loading...");
  text.fadeIn(2000);
  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["effects"]);
  await setScrollingSpeed(100, 0, { instant: true });
  await setScenery("city.Ocean");
  setBackground("city.Sunrise", 0, 5);
  text.remove();
  await fade.start(2000);
  await wait(5e3);
  await setScrollingSpeed(500, 0);
  console.log("Say!");
  await say(
    "General",
    "Let us escort you to the factory to install\n" +
      "the AI controlled defence systems. You are the last ship.",
    { portrait: "portraits.general" }
  );
  console.log("End Say!");
  addScreenTrauma(0.8);
  addScreenTrauma(0.8);
  addScreenTrauma(0.8);
  addScreenTrauma(0.8);
  await say("John", "Let's go!", { portrait: "portraits.pilot" });
  await exec(droneWave(4, "drone.straight", 500, 0.1));
  addScreenTrauma(0.8);
  addScreenTrauma(0.8);
  addScreenTrauma(0.8);
  addScreenTrauma(0.8);
  await exec(droneWave(4, "drone.straight", 500, -0.1));
  await exec(droneWave(4, "drone.straight", 500, -0.3));
  await setAltitude(200);
  await exec(droneWave(5, "drone.pattern1", 500));
  await exec(droneWave(8, "drone.pattern2", 500));
  await setAltitude(0);
  await exec(droneWave(5, "drone.pattern3", 500));
  await setScrollingSpeed(100, 0);
  await exec(mineWave());
  await exec(droneWave(5, "drone.pattern3", 500));
  await setScenery("city.CoastStart");
  await exec(mineWave());
  await setScrollingSpeed(250, 0);
  await wait(20e3);
  await setScenery("city.BayStart");
  await wait(40e3);
  await setScenery("city.Bridge");
  await wait(40e3);
};

export default part;
