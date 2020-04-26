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

export const setEffectVolume = volume =>
  playingPool.effectsGain.gain.setValueAtTime(volume, context.currentTime);

export const setMusicVolume = volume =>
  playingPool.musicGain.gain.setValueAtTime(volume, context.currentTime);

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

export const playAudio = async (sampleName, { volume = 1.0 } = {}) => {
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

    const sampleSettings = map.map[sampleName];
    const sampleVolume =
      volume *
      (sampleSettings.volume === undefined ? 1.0 : sampleSettings.volume);
    source.loop = sampleSettings.loop;

    const sampleGain = context.createGain();
    sampleGain.connect(playingPool.effectsGain);
    sampleGain.gain.setValueAtTime(sampleVolume, context.currentTime);

    source.connect(sampleGain);
    source.start(
      context.currentTime,
      sampleSettings.start / 1000,
      (sampleSettings.end - sampleSettings.start) / 1000
    );
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
