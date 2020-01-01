const audioData = {};

const context = new AudioContext();

export const loadAudio = async audioMap => {
  const file = await window.fetch(audioMap.file);
  const buffer = await file.arrayBuffer();
  audioData[audioMap.name] = {
    audioData: await context.decodeAudioData(buffer),
    map: audioMap.map
  };
};

export const playAudio = async sampleName => {
  const map = Object.values(audioData).find(e => e.map[sampleName]);
  const source = context.createBufferSource();
  source.buffer = map.audioData;
  source.connect(context.destination);
  source.start();
};
