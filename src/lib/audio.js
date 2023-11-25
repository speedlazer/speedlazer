import settings from "../settings.json";

export const createAudioPlayer = () => {
  const audioData = {};
  const AudioContext = window.AudioContext || window.webkitAudioContext;

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

  const currentMusic = () => {
    if (playingPool.music !== null) {
      return playingPool.music.sampleName;
    }
  };

  let audioPaused = false;

  const stopMusic = () => {
    if (playingPool.music !== null) {
      playingPool.music.source.stop();
      playingPool.music.source.disconnect();
      playingPool.music = null;
    }
  };

  let effectsVolume = 1.0;
  let musicVolume = 1.0;

  const api = {
    pauseAudio: () => {
      audioPaused = true;
      context.suspend();
    },

    resumeAudio: () => {
      audioPaused = false;
      context.resume();
    },

    setEffectVolume: volume => {
      playingPool.effectsGain.gain.setValueAtTime(volume, context.currentTime);
      effectsVolume = volume;
    },

    setMusicVolume: volume => {
      playingPool.musicGain.gain.setValueAtTime(volume, context.currentTime);
      musicVolume = volume;
    },

    getEffectsVolume: () => effectsVolume,
    getMusicVolume: () => musicVolume,

    loadAudio: async audioMap => {
      const name = audioMap.name;
      if (audioData[name]) {
        return audioData[name];
      }

      const file = await window.fetch(audioMap.file);
      const buffer = await file.arrayBuffer();
      const decodedData = await context.decodeAudioData(buffer);
      assignAudioBuffer(audioMap, decodedData);

      return audioData[name];
    },

    stopMusic,

    fadeMusicVolume: (volume = 0, duration = 1000) => {
      if (playingPool.music !== null) {
        return playingPool.music.setVolume(volume, duration);
      }
    },

    playAudio: (sampleName, { volume = 1.0 } = {}) => {
      const map = Object.values(audioData).find(e => e.map[sampleName]);
      const sampleData = map.map[sampleName];
      if (sampleData.type === "music") {
        if (settings.music === false) return;
        if (currentMusic() === sampleName) return;
        // Cross fade if track is already playing??
        stopMusic();

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

        const process = new Promise(resolve => (source.onended = resolve));

        const setVolume = async (value, duration = 0) => {
          const newVolume = value * baseVolume;
          trackGain.gain.exponentialRampToValueAtTime(
            newVolume === 0 ? 0.01 : newVolume,
            context.currentTime + duration / 1000.0
          );
        };
        playingPool.music = { source, sampleName, setVolume };

        return {
          stop: () => source.stop(),
          setVolume,
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
    }
  };

  document.addEventListener(
    "visibilitychange",
    () => {
      if (audioPaused) return;
      if (document["hidden"]) {
        context.suspend();
      } else {
        context.resume();
      }
    },
    false
  );

  return api;
};

const defaultAudio = createAudioPlayer();

export default defaultAudio;
