import { droneWave } from "./enemies/drones.lazer";
import { mineWave } from "./enemies/mines.lazer";
import { playerShip } from "../playerShip.lazer";
import { helicopter } from "./enemies/helicopter.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";

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
  await loadAudio(["effects", "interactive"]);
  playAudio("pattern.default");

  await setScrollingSpeed(100, 0, { instant: true });
  await setScenery("City.Coast");
  setBackground("City.Sunrise", 2, 3);
  showHUD();
  text.remove();
  exec(playerShip({ existing: true }));

  await setScrollingSpeed(250, 0);
  await parallel([
    () => exec(droneWave(4, "drone.straight", { delay: 300, yOffset: 0.1 })),
    async () => {
      await wait(3000);
      await exec(droneWave(4, "drone.straight", { delay: 300, yOffset: -0.1 }));
    },
    async () => {
      await wait(6000);
      await setScenery("City.BayStart");
      await exec(droneWave(4, "drone.straight", { delay: 300, yOffset: -0.3 }));
    }
  ]);
  await exec(droneWave(5, "drone.pattern1"));
  await exec(droneWave(8, "drone.pattern2"));
  await exec(mineWave());
  await setScenery("City.Bridge");
  playAudio("pattern.someStress");
  await exec(helicopter("heli.pattern1", "heli.repeat1"));
  await parallel([
    () => exec(droneWave(5, "drone.pattern3")),
    () => exec(droneWave(5, "drone.pattern5"))
  ]);
  await exec(mineWave());
  await parallel([
    () => exec(helicopter("heli.pattern1", "heli.repeat2")),
    async () => {
      await wait(5000);
      await exec(helicopter("heli.pattern1", "heli.repeat1"));
    }
  ]);
  await wait(2000);
  await parallel([
    () => exec(droneWave(5, "drone.pattern3")),
    () => exec(droneWave(5, "drone.pattern5"))
  ]);
};

export default part;
