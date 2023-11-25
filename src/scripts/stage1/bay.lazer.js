import { droneWave } from "./enemies/drones.lazer";
import { mineWave } from "./enemies/mines.lazer";
import { playerShip } from "../playerShip.lazer";
import { helicopter } from "./enemies/helicopter.lazer";
import { bigText } from "../../components/BigText";
import { checkpoint } from "../common.lazer";
import audio from "../../lib/audio";

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

  await setScrollingSpeed(250, 0, { instant: true });
  await setScenery("city.Bay");
  setBackground("city.Sunrise", 3, 3);
  showHUD();
  text.remove();
  exec(playerShip({ existing: true, hasLaser: true }));

  await exec(droneWave(5, "drone.pattern1"));
  await exec(droneWave(8, "drone.pattern2"));
  await exec(mineWave());
  await setScenery("city.Bridge");
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
  await exec(checkpoint);
};

export default part;
