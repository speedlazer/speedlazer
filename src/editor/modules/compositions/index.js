import { CompositionPreview } from "./components/CompositionPreview";
import { Menu } from "../../components/Menu";
import { h, Component } from "preact";
import compositions from "src/data/compositions";
import style from "./style.scss";

class Compositions extends Component {
  constructor() {
    super();
    this.state = {
      showSize: false,
      showHitBox: false,
      showRotationPoints: false
    };
  }

  render(
    { compositionName, frameName },
    { showSize, showHitBox, showRotationPoints }
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
          <label class={style.text}>
            <input
              type="checkbox"
              onChange={e => {
                this.setState({ showSize: e.target.checked });
              }}
              checked={showSize}
            />{" "}
            Show size
          </label>
          <label class={style.text}>
            <input
              type="checkbox"
              onChange={e => {
                this.setState({ showHitBox: e.target.checked });
              }}
              checked={showHitBox}
            />{" "}
            Show hitbox
          </label>
          <label class={style.text}>
            <input
              type="checkbox"
              onChange={e => {
                this.setState({ showRotationPoints: e.target.checked });
              }}
              checked={showRotationPoints}
            />{" "}
            Show rotation points
          </label>
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
          />
        )}
      </section>
    );
  }
}

export default Compositions;
