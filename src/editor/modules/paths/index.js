import { h, Component } from "preact";
import { Title } from "editor/components/Title";
import { Menu } from "editor/components/Menu";
import { Source } from "editor/components/Source";
import { Divider } from "editor/components/Divider";
import { Setting } from "editor/components/Setting";
import FlyPatternPreview from "./FlyPatternPreview";
import { paths, pathsData } from "data";

const DEFAULT_STATE = {
  showPoints: true,
  showPath: true
};

const STORAGE_KEY = "editor-flyPattern-settings";
const storeState = newState =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

const storedState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
};

class FlyPatterns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...DEFAULT_STATE,
      ...storedState()
    };
  }

  updateShowPoints = checked => {
    this.setState(s => ({ ...s, showPoints: checked }));
  };

  updateShowPath = checked => {
    this.setState(s => ({ ...s, showPath: checked }));
  };

  render({ pattern }, { showPoints, showPath }) {
    const activePattern = paths(pattern);
    storeState(this.state);
    const items = [].concat(
      Object.keys(pathsData).map(key => [key, `/paths/${key}`])
    );
    return (
      <section>
        <Title>Paths{pattern && ` - ${pattern}`}</Title>
        <Divider>
          <Menu hoverHide={activePattern} items={items} />
          <div>
            <div>
              <Setting checked={showPoints} onCheck={this.updateShowPoints}>
                Show points
              </Setting>
              <Setting checked={showPath} onCheck={this.updateShowPath}>
                Show path
              </Setting>
            </div>
            {activePattern && (
              <FlyPatternPreview
                pattern={activePattern}
                showPath={showPath}
                showPoints={showPoints}
              />
            )}
            {activePattern && <Source code={activePattern} />}
          </div>
        </Divider>
      </section>
    );
  }
}

export default FlyPatterns;
