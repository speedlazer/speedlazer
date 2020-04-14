import { h, Component } from "preact";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import audiosheets from "src/audio";
import { loadAudio, playAudio } from "src/lib/audio";

const pad = (num, length) => ("0".repeat(length) + num).slice(-length);

const duration = durationInSeconds => {
  const mins = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds - mins * 60);
  const rest = durationInSeconds % 1 || "0.0";

  return `${mins}:${pad(seconds, 2)}.${rest.toString().slice(2, 5)}`;
};

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
      this.audio = await playAudio(this.props.activeSample);
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
        <Title>Audio sheets</Title>
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
            {activeAudio && (
              <Text>Duration: {duration(activeAudio.audioData.duration)}</Text>
            )}
          </div>
        </Divider>
      </section>
    );
  }
}

export default Audiosheets;
