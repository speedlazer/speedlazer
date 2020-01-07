const audioData = {};

const context = new AudioContext();

const playingPool = {
  music: null,
  effectsGain: context.createGain(),
  musicGain: context.createGain()
};
playingPool.effectsGain.connect(context.destination);
playingPool.musicGain.connect(context.destination);

const assignAudioBuffer = (audioMap, decodedData) => {
  audioData[audioMap.name] = {
    audioData: decodedData,
    map: audioMap.map
  };
};

export const loadAudio = async audioMap => {
  const name = audioMap.name;
  if (audioData[name]) {
    return audioData[name];
  }

  const file = await window.fetch(audioMap.file);
  const buffer = await file.arrayBuffer();
  const decodedData = await context.decodeAudioData(buffer);
  assignAudioBuffer(audioMap, decodedData);

  return audioData[name];
};

export const stopMusic = () => {
  if (playingPool.music !== null) {
    playingPool.music.stop();
    playingPool.music.disconnect();
    playingPool.music = null;
  }
};

export const playAudio = async sampleName => {
  const map = Object.values(audioData).find(e => e.map[sampleName]);
  const sampleData = map.map[sampleName];
  if (sampleData.type === "music") {
    // Cross fade if track is already playing??
    stopMusic();
    const source = context.createBufferSource();
    source.buffer = map.audioData;
    source.connect(playingPool.musicGain);
    source.start();
    playingPool.music = source;
    return source;
  } else {
    const source = context.createBufferSource();
    source.buffer = map.audioData;
    source.connect(playingPool.effectsGain);
    source.start();
    return source;
  }
};

document.addEventListener(
  "visibilitychange",
  () => {
    if (document["hidden"]) {
      context.suspend();
    } else {
      context.resume();
    }
  },
  false
);
