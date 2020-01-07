import { SceneryPreview } from "./SceneryPreview";
import sceneries from "src/data/sceneries";
import animations from "src/data/animations";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { h, Component } from "preact";

class Sceneries extends Component {
  state = {
    scrollSpeed: 0
  };

  toRight = () => {
    this.setState(state => ({ ...state, scrollSpeed: state.scrollSpeed + 20 }));
  };

  toLeft = () => {
    this.setState(state => ({ ...state, scrollSpeed: state.scrollSpeed - 20 }));
  };

  stop = () => {
    this.setState(state => ({ ...state, scrollSpeed: 0 }));
  };

  render({ scenery }, { scrollSpeed }) {
    const activeScenery = sceneries[scenery];

    const backgroundSetting =
      activeScenery &&
      activeScenery.backgrounds &&
      activeScenery.backgrounds[0] &&
      activeScenery.backgrounds[0];
    const background = backgroundSetting && animations[backgroundSetting[0]];

    return (
      <section>
        <Title>Scenery</Title>
        <Divider>
          <Menu
            items={Object.keys(sceneries).map(key => [
              key,
              `/sceneries/${key}`
            ])}
          />
          {activeScenery && (
            <div>
              <button onClick={this.toRight}>&laquo;</button>
              <button onClick={this.stop}>Stop</button>
              <button onClick={this.toLeft}>&raquo;</button>
              <Text>Current speed: x: {scrollSpeed}</Text>
              <Text>
                Current background: {backgroundSetting && backgroundSetting[0]}{" "}
                - {backgroundSetting && backgroundSetting[1]}
              </Text>
              <SceneryPreview
                scenery={scenery}
                background={background}
                backgroundCheckpoint={backgroundSetting && backgroundSetting[1]}
                scrollSpeed={scrollSpeed}
              />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Sceneries;
