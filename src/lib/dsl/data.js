import audiosheets from "src/audio";
import audio from "src/lib/audio";
import { loadSpriteSheets } from "src/lib/sprites";

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
