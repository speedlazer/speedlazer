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
        loopStart: entry.loopStart,
        loopEnd: entry.loopEnd,
        volume: entry.volume,
        tracks: entry.tracks,
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
  const current = currentMusic();
  if (current) current.stop();
};

const currentMusic = () => playingPool.music;

export const fadeMusicVolume = (volume = 0, duration = 1000) => {
  if (playingPool.music !== null) {
    return playingPool.music.setVolume(volume, duration);
  }
};

export const playAudio = (sampleName, { volume = 1.0 } = {}) => {
  const map = Object.values(audioData).find(e => e.map[sampleName]);
  const sampleData = map.map[sampleName];
  if (sampleData.type === "pattern") {
    const current = currentMusic();
    if (current && current.name === sampleName) return;
    // Cross fade if track is already playing??
    let start = context.currentTime;

    if (current) {
      if (current.type === "pattern") {
        start =
          current.start +
          Math.ceil((context.currentTime - current.start) / current.duration) *
            current.duration;
        current.stop(start);
      } else {
        current.stop();
      }
    }

    const baseVolume =
      sampleData.volume === undefined ? 1.0 : sampleData.volume;
    const sampleVolume = volume * baseVolume;

    const trackGain = context.createGain();
    trackGain.connect(playingPool.musicGain);
    trackGain.gain.setValueAtTime(
      sampleVolume === 0 ? 0.01 : sampleVolume,
      start
    );

    const tracks = sampleData.tracks.map(layer => {
      const track = map.map[layer];

      const source = context.createBufferSource();
      source.buffer = map.audioData;
      source.connect(trackGain);
      if (track.loop) {
        source.loop = true;
        source.loopStart = track.start / 1000.0;
        source.loopEnd = track.end / 1000.0;
      }
      source.start(start, track.start / 1000.0);
      return source;
    });

    const setVolume = async (value, duration = 0) => {
      const newVolume = value * baseVolume;
      trackGain.gain.exponentialRampToValueAtTime(
        newVolume === 0 ? 0.01 : newVolume,
        context.currentTime + duration / 1000.0
      );
    };

    const stop = (time = context.currentTime) => {
      console.log("Stopping over ", time - context.currentTime);
      tracks.forEach(source => {
        source.stop(time);
        //source.disconnect();
      });
      playingPool.music = null;
    };

    const process = Promise.all(
      tracks.map(source => new Promise(resolve => (source.onended = resolve)))
    ).then(() => console.log("Track", sampleName, "ended"));
    playingPool.music = {
      type: sampleData.type,
      tracks,
      sampleName,
      setVolume,
      stop,
      process,
      start,
      duration: sampleData.duration / 1000
    };

    return playingPool.music;
  }
  if (sampleData.type === "music") {
    const current = currentMusic();
    if (current && current.name === sampleName) return;
    // Cross fade if track is already playing??
    current && current.stop();

    const baseVolume =
      sampleData.volume === undefined ? 1.0 : sampleData.volume;

    const sampleVolume = volume * baseVolume;
    const source = context.createBufferSource();
    source.buffer = map.audioData;

    const trackGain = context.createGain();
    trackGain.connect(playingPool.musicGain);
    trackGain.gain.setValueAtTime(
      sampleVolume === 0 ? 0.01 : sampleVolume,
      context.currentTime
    );

    source.connect(trackGain);
    if (sampleData.loop) {
      source.loop = true;
      if (sampleData.loopStart) {
        source.loopStart = sampleData.loopStart;
      }
      if (sampleData.loopEnd) {
        source.loopEnd = sampleData.loopEnd;
      }
    }

    source.start();

    const setVolume = async (value, duration = 0) => {
      const newVolume = value * baseVolume;
      trackGain.gain.exponentialRampToValueAtTime(
        newVolume === 0 ? 0.01 : newVolume,
        context.currentTime + duration / 1000.0
      );
    };

    const stop = () => {
      source.stop();
      source.disconnect();
      playingPool.music = null;
    };
    const process = new Promise(resolve => (source.onended = resolve));

    playingPool.music = {
      type: sampleData.type,
      source,
      sampleName,
      setVolume,
      stop,
      process
    };

    return playingPool.music;
  } else {
    const source = context.createBufferSource();
    source.buffer = map.audioData;

    const baseVolume =
      sampleData.volume === undefined ? 1.0 : sampleData.volume;
    const sampleVolume = volume * baseVolume;
    if (sampleData.loop) {
      source.loop = true;
      source.loopStart = sampleData.start / 1000.0;
      source.loopEnd = sampleData.end / 1000.0;
    }

    const sampleGain = context.createGain();
    sampleGain.connect(playingPool.effectsGain);
    sampleGain.gain.setValueAtTime(
      sampleVolume === 0 ? 0.01 : sampleVolume,
      context.currentTime
    );

    source.connect(sampleGain);
    source.start(
      context.currentTime,
      sampleData.start / 1000.0,
      source.loop ? undefined : sampleData.duration / 1000.0
    );
    const process = new Promise(resolve => (source.onended = resolve));

    return {
      stop: () => source.stop(),
      setVolume: async (value, duration = 0) => {
        const newVolume = value * baseVolume;
        sampleGain.gain.exponentialRampToValueAtTime(
          newVolume === 0 ? 0.01 : newVolume,
          context.currentTime + duration / 1000.0
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
