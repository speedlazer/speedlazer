import { h, Component } from "preact";
import { CompositionPreview } from "./components/CompositionPreview";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import { Setting } from "../../components/Setting";
import compositions from "src/data/compositions";

const DEFAULT_STATE = {
  showSize: false,
  showHitBox: false,
  showRotationPoints: false,
  showAttachPoints: false,
  scaleViewport: true
};

const STORAGE_KEY = "editor-composition-settings";
const storeState = newState =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

const storedState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
};

class Compositions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...DEFAULT_STATE,
      ...storedState()
    };
  }

  updateShowSize = checked => {
    this.setState(s => ({ ...s, showSize: checked }));
  };

  updateShowHitBox = checked => {
    this.setState(s => ({ ...s, showHitBox: checked }));
  };

  updateShowRotationPoints = checked => {
    this.setState(s => ({ ...s, showRotationPoints: checked }));
  };

  updateShowAttachPoints = checked => {
    this.setState(s => ({ ...s, showAttachPoints: checked }));
  };

  updateScaleViewport = checked => {
    this.setState(s => ({ ...s, scaleViewport: checked }));
  };

  render(
    { compositionName, frameName },
    {
      showSize,
      showHitBox,
      showRotationPoints,
      showAttachPoints,
      scaleViewport
    }
  ) {
    const activeComposition = compositions[compositionName];
    storeState(this.state);

    return (
      <section>
        <Title>Compositions</Title>
        <Divider>
          <Menu
            items={Object.keys(compositions).map(key => [
              key,
              `/compositions/${key}`
            ])}
          />
          <div>
            <div>
              <Setting
                checked={scaleViewport}
                onCheck={this.updateScaleViewport}
              >
                Rescale viewport
              </Setting>
              <Setting checked={showSize} onCheck={this.updateShowSize}>
                Show size
              </Setting>
              <Setting checked={showHitBox} onCheck={this.updateShowHitBox}>
                Show hitbox
              </Setting>
              <Setting
                checked={showRotationPoints}
                onCheck={this.updateShowRotationPoints}
              >
                Show rotation points
              </Setting>
              <Setting
                checked={showAttachPoints}
                onCheck={this.updateShowAttachPoints}
              >
                Show attach points
              </Setting>
            </div>
            {activeComposition && activeComposition.frames && (
              <Menu
                horizontal={true}
                items={[
                  "default",
                  ...Object.keys(activeComposition.frames)
                ].map(key => [
                  key,
                  `/compositions/${compositionName}/frames/${key}`
                ])}
              />
            )}
            {activeComposition && (
              <CompositionPreview
                composition={activeComposition}
                frame={frameName}
                tweenDuration={1000}
                showSize={showSize}
                showHitBox={showHitBox}
                scaleViewport={scaleViewport}
                showRotationPoints={showRotationPoints}
                showAttachPoints={showAttachPoints}
              />
            )}
          </div>
        </Divider>
      </section>
    );
  }
}

export default Compositions;