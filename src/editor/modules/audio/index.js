import { h, Component } from "preact";
import { Title } from "../../components/Title";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import audiosheets from "src/data/audio";
import { loadAudio, playAudio } from "src/lib/audio";

class Audiosheets extends Component {
  playAudio = async () => {
    const activeMap =
      audiosheets.find(m => m.name === this.props.map) || audiosheets[0];
    await loadAudio(activeMap);
    await playAudio(this.props.activeSample);
  };

  render({ map, activeSample }) {
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
            {highlight && <button onClick={this.playAudio}>Play</button>}
          </div>
        </Divider>
      </section>
    );
  }
}

export default Audiosheets;
