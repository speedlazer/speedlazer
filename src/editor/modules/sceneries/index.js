import { SceneryPreview } from "./components/SceneryPreview";
import sceneries from "src/data/sceneries";
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
              <SceneryPreview scenery={scenery} scrollSpeed={scrollSpeed} />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Sceneries;
