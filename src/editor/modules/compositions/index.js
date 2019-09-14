import { h, Component } from "preact";
import { CompositionPreview } from "./components/CompositionPreview";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import compositions from "src/data/compositions";
import style from "./style.scss";

const Setting = ({ checked, onCheck, children }) => (
  <label class={style.text}>
    <input type="checkbox" onChange={onCheck} checked={checked} /> {children}
  </label>
);

const DEFAULT_STATE = {
  showSize: false,
  showHitBox: false,
  showRotationPoints: false,
  showAttachPoints: false
};

const STORAGE_KEY = "editor-display";
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
  constructor() {
    super();
    this.state = {
      ...DEFAULT_STATE,
      ...storedState()
    };
  }

  updateShowSize = e => {
    this.setState({ showSize: e.target.checked });
  };

  updateShowHitBox = e => {
    this.setState({ showHitBox: e.target.checked });
  };

  updateShowRotationPoints = e => {
    this.setState({ showRotationPoints: e.target.checked });
  };

  updateShowAttachPoints = e => {
    this.setState({ showAttachPoints: e.target.checked });
  };

  render(
    { compositionName, frameName },
    { showSize, showHitBox, showRotationPoints, showAttachPoints }
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
            {activeComposition &&
              activeComposition.frames && (
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
