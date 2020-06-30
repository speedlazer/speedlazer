import { h, Component } from "preact";
import { SceneryPreview } from "./SceneryPreview";
import { Menu } from "editor/components/Menu";
import { CentralMenu } from "editor/components/CentralMenu";
import { Source } from "editor/components/Source";
import { Divider } from "editor/components/Divider";
import { Title } from "editor/components/Title";
import { Text } from "editor/components/Text";
import { sceneries, animations } from "data";

class Sceneries extends Component {
  state = {
    scrollSpeed: 0,
    altIndex: 0
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

  render({ scenery }, { scrollSpeed, altIndex }) {
    const activeScenery = sceneries(scenery);

    const backgroundSetting =
      activeScenery &&
      activeScenery.backgrounds &&
      activeScenery.backgrounds[0];
    const background = backgroundSetting && animations(backgroundSetting[0]);

    const altitudes = activeScenery && activeScenery.altitudes;
    const altitude = (altitudes && altitudes[altIndex]) || 0;

    return (
      <section>
        <Title>Scenery{scenery && ` - ${scenery}`}</Title>
        <Divider>
          <CentralMenu root="sceneries" />
          {activeScenery && (
            <div>
              <button onClick={this.toRight}>&laquo;</button>
              <button onClick={this.stop}>Stop</button>
              <button onClick={this.toLeft}>&raquo;</button>
              <Text>Current speed: x: {scrollSpeed}</Text>
              <Text>Current altitude: {altitude}</Text>
              <Text>
                Current background: {backgroundSetting && backgroundSetting[0]}{" "}
                - {backgroundSetting && backgroundSetting[1]}
              </Text>
              <Menu
                horizontal={true}
                items={(altitudes || []).map((alt, index) => [
                  `altitude ${alt}`,
                  () => {
                    this.setState({ altIndex: index });
                  }
                ])}
              />
              <SceneryPreview
                scenery={scenery}
                altitude={altitude}
                background={background}
                backgroundCheckpoint={backgroundSetting && backgroundSetting[1]}
                scrollSpeed={scrollSpeed}
              />
              <Source code={activeScenery} />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Sceneries;
