import { SceneryPreview } from "./components/SceneryPreview";
import sceneries from "src/data/sceneries";
import { Menu } from "../../components/Menu";
import { h, Component } from "preact";
import { setScrollVelocity } from "src/components/Scenery";

class Sceneries extends Component {
  state = {
    scrollSpeed: 0
  };

  toRight = () => {
    this.setState(state => ({ ...state, scrollSpeed: state.scrollSpeed + 10 }));
  };

  toLeft = () => {
    this.setState(state => ({ ...state, scrollSpeed: state.scrollSpeed - 10 }));
  };

  render({ scenery }, { scrollSpeed }) {
    const activeScenery = sceneries[scenery];
    return (
      <section>
        <h1 style={{ color: "white" }}>Scenery</h1>
        <Menu
          items={Object.entries(sceneries).map(([key]) => [
            key,
            `/sceneries/${key}`
          ])}
        />
        {activeScenery && (
          <div>
            <button onClick={this.toRight}>Right</button>
            <button onClick={this.toLeft}>Left</button>
            <SceneryPreview scenery={scenery} scrollSpeed={scrollSpeed} />
          </div>
        )}
      </section>
    );
  }
}

export default Sceneries;
