import spritesheets from "src/images";
import audiosheets from "src/audio";
import { loadAudio } from "src/lib/audio";

const dataFunctions = () => ({
  loadSpriteSheets: async sheetNames =>
    new Promise(resolve => {
      const loader = {
        sprites: {}
      };
      spritesheets
        .filter(sheet => sheetNames.includes(sheet.name))
        .forEach(sheet => {
          loader.sprites[sheet.image] = sheet.map;
        });
      Crafty.load(loader, resolve);
    }),
  loadAudio: async audioMaps =>
    Promise.all(
      audioMaps
        .map(mapName => audiosheets.find(e => e.name === mapName))
        .filter(Boolean)
        .map(map => loadAudio(map))
    )
});

export default dataFunctions;
