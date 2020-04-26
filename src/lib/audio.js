const audioData = {};

const context = new AudioContext();

const playingPool = {
  music: null,
  effectsGain: context.createGain(),
  musicGain: context.createGain()
};
playingPool.effectsGain.connect(context.destination);
playingPool.musicGain.connect(context.destination);

const convertAudioMap = map =>
  map.reduce((acc, entry, i, l) => {
    const previous = i > 0 && acc[l[i - 1].name];
    const start = i === 0 ? 0 : previous.end;
    return {
      ...acc,
      [entry.name]: {
        type: entry.type,
        start,
        end: start + entry.duration,
        duration: entry.duration,
        volume: entry.volume,
        loop: entry.loop
      }
    };
  }, {});

const assignAudioBuffer = (audioMap, decodedData) => {
  audioData[audioMap.name] = {
    audioData: decodedData,
    map: convertAudioMap(audioMap.map)
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

export const playAudio = (sampleName, { volume = 1.0 } = {}) => {
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
    const process = new Promise(resolve => (source.onended = resolve));

    return {
      stop: () => source.stop(),
      process
    };
  } else {
    const source = context.createBufferSource();
    source.buffer = map.audioData;

    const baseVolume =
      sampleData.volume === undefined ? 1.0 : sampleData.volume;
    const sampleVolume = volume * baseVolume;
    if (sampleData.loop) {
      source.loop = true;
      source.loopStart = sampleData.start / 1000;
      source.loopEnd = sampleData.end / 1000;
    }

    const sampleGain = context.createGain();
    sampleGain.connect(playingPool.effectsGain);
    sampleGain.gain.setValueAtTime(sampleVolume, context.currentTime);

    source.connect(sampleGain);
    source.start(
      context.currentTime,
      sampleData.start / 1000,
      source.loop ? undefined : sampleData.duration / 1000
    );
    const process = new Promise(resolve => (source.onended = resolve));

    return {
      stop: () => source.stop(),
      setVolume: async (value, duration = 0) => {
        const newVolume = value * baseVolume;
        sampleGain.gain.exponentialRampToValueAtTime(
          newVolume === 0 ? 0.01 : newVolume,
          context.currentTime + duration / 1000
        );
      },
      process
    };
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
