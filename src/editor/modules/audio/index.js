import { h, Component } from "preact";
import { Title } from "editor/components/Title";
import { Table } from "editor/components/Table";
import { Text } from "editor/components/Text";
import { Menu } from "editor/components/Menu";
import { Divider } from "editor/components/Divider";
import audiosheets from "src/audio";
import {
  loadAudio,
  playAudio,
  setEffectVolume,
  setMusicVolume
} from "src/lib/audio";

setEffectVolume(0.4);
setMusicVolume(0.5);

const pad = (num, length) => ("0".repeat(length) + num).slice(-length);

const duration = durationInSeconds => {
  const mins = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds - mins * 60);
  const rest = durationInSeconds % 1 || "0.0";

  return `${mins}:${pad(seconds, 2)}.${rest.toString().slice(2, 5)}`;
};

const percent = (value, defaultValue) => {
  const perc = (value === undefined ? defaultValue : value) * 100;
  return `${Math.round(perc)}%`;
};

const numb = value =>
  `${value}`
    .split("")
    .reverse()
    .reduce(
      (acc, c, i) =>
        i % 3 === 0 && i > 0 ? acc.concat(".", c) : acc.concat(c),
      []
    )
    .reverse()
    .join("");

class Audiosheets extends Component {
  state = {
    activeAudio: null,
    playing: false
  };

  loadAudio = async map => {
    const activeAudio = await loadAudio(map);
    this.setState(s => ({ ...s, activeAudio }));
  };

  playAudio = async () => {
    if (this.state.playing) {
      this.audio && this.audio.stop();
    } else {
      this.audio = await playAudio(this.props.activeSample, { volume: 1 });
      this.audio.onended = () => {
        this.setState(s => ({ ...s, playing: false }));
      };
      this.setState(s => ({ ...s, playing: true }));
    }
  };

  componentDidMount() {
    if (this.props.map) {
      this.loadFromMap(this.props.map);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.map !== this.props.map) {
      this.loadFromMap(this.props.map);
    }
  }

  loadFromMap(map) {
    const activeMap = audiosheets.find(m => m.name === map) || audiosheets[0];
    this.loadAudio(activeMap);
  }

  render({ map, activeSample }, { activeAudio, playing }) {
    const activeMap = audiosheets.find(m => m.name === map) || audiosheets[0];

    const highlight = (activeSample && activeMap.map[activeSample]) || null;

    return (
      <section>
        <Title>Audio sheets{activeSample && ` - ${map}.${activeSample}`}</Title>
        <Divider>
          <Menu
            items={audiosheets.reduce(
              (acc, map) =>
                acc.concat(
                  Object.keys(map.map).map(spriteName => [
                    `${map.name}.${spriteName}`,
                    `/audio/${map.name}/${spriteName}`
                  ])
                ),
              []
            )}
          />
          <div>
            {highlight && (
              <button
                disabled={activeAudio ? false : "disabled"}
                onClick={this.playAudio}
              >
                {playing ? "Stop" : "Play"}
              </button>
            )}
            {highlight && (
              <Table>
                {activeAudio && (
                  <Text label="File duration:">
                    {duration(activeAudio.audioData.duration)}
                  </Text>
                )}
                <Text label="Sample duration:">
                  {numb(highlight.end - highlight.start)}ms
                </Text>
                <Text label="Start:">{numb(highlight.start)}ms</Text>
                <Text label="End:">{numb(highlight.end)}ms</Text>
                <Text label="Volume adjustment:">
                  {percent(highlight.volume, 1.0)}
                </Text>
              </Table>
            )}
          </div>
        </Divider>
      </section>
    );
  }
}

export default Audiosheets;
