import { h, Component } from "preact";
import { Title } from "editor/components/Title";
import { Table } from "editor/components/Table";
import { Text } from "editor/components/Text";
import { Menu } from "editor/components/Menu";
import { Divider } from "editor/components/Divider";
import audiosheets from "src/audio";
import audio from "src/lib/audio";

audio.setEffectVolume(0.4);
audio.setMusicVolume(0.5);

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
    const activeAudio = await audio.loadAudio(map);
    this.setState(s => ({ ...s, activeAudio }));
  };

  playAudio = async () => {
    if (this.state.playing) {
      this.audio && this.audio.stop();
    } else {
      this.audio = await audio.playAudio(this.props.activeSample, {
        volume: 1
      });
      this.audio.process.then(() => {
        this.setState(s => ({ ...s, playing: false }));
      });
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

    const highlight =
      (activeSample && activeMap.map.find(e => e.name === activeSample)) ||
      null;

    return (
      <section>
        <Title>Audio sheets{activeSample && ` - ${map}.${activeSample}`}</Title>
        <Divider>
          <Menu
            items={audiosheets.reduce(
              (acc, sheet) =>
                acc.concat(
                  sheet.map.map(sprite => [
                    `${sheet.name}.${sprite.name}`,
                    `/audio/${sheet.name}/${sprite.name}`
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
                <Text label="Type:">{highlight.type}</Text>
                {activeAudio && (
                  <Text label="File duration:">
                    {duration(activeAudio.audioData.duration)}
                  </Text>
                )}
                {highlight.duration && (
                  <Text label="Sample duration:">
                    {numb(highlight.duration)}ms
                  </Text>
                )}
                <Text label="Volume adjustment:">
                  {percent(highlight.volume, 1.0)}
                </Text>
                <Text label="Loop:">{highlight.loop ? "Yes" : "No"}</Text>
              </Table>
            )}
          </div>
        </Divider>
      </section>
    );
  }
}

export default Audiosheets;
