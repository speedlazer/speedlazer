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
    playingPool.music.source.stop();
    playingPool.music.source.disconnect();
    playingPool.music = null;
  }
};

const currentMusic = () => {
  if (playingPool.music !== null) {
    return playingPool.music.sampleName;
  }
};

export const playAudio = async sampleName => {
  const map = Object.values(audioData).find(e => e.map[sampleName]);
  const sampleData = map.map[sampleName];
  if (sampleData.type === "music") {
    if (currentMusic() === sampleName) return;
    // Cross fade if track is already playing??
    stopMusic();
    const source = context.createBufferSource();
    source.buffer = map.audioData;
    source.connect(playingPool.musicGain);
    source.start();
    playingPool.music = { source, sampleName };
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
