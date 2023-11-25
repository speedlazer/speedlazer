import audiosheets from "../../audio";
import audio from "../audio";
import { loadSpriteSheets } from "../sprites";

const dataFunctions = () => ({
  loadSpriteSheets,
  loadAudio: async audioMaps =>
    Promise.all(
      audioMaps
        .map(mapName => audiosheets.find(e => e.name === mapName))
        .filter(Boolean)
        .map(map => audio.loadAudio(map))
    )
});

export default dataFunctions;
