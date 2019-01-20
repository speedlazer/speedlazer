import { CompositionPreview } from "./components/CompositionPreview";
import { Menu } from "../../components/Menu";
import { h, Component } from "preact";
import compositions from "src/data/compositions";
import style from "./style.scss";

const Setting = ({ checked, onCheck, children }) => (
  <label class={style.text}>
    <input type="checkbox" onChange={onCheck} checked={checked} /> {children}
  </label>
);

class Compositions extends Component {
  constructor() {
    super();
    this.state = {
      showSize: false,
      showHitBox: false,
      showRotationPoints: false,
      showAttachPoints: false
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

    return (
      <section>
        <h1 class={style.text}>Compositions</h1>
        <Menu
          items={Object.keys(compositions).map(key => [
            key,
            `/compositions/${key}`
          ])}
        />
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
              items={["default", ...Object.keys(activeComposition.frames)].map(
                key => [key, `/compositions/${compositionName}/frames/${key}`]
              )}
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
      </section>
    );
  }
}

export default Compositions;
