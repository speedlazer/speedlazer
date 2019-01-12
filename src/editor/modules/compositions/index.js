import { Menu } from "../../components/Menu";
import { h, Component } from "preact";
import { CompositionPreview } from "./components/CompositionPreview";
import compositions from "src/data/compositions";

class Compositions extends Component {
  render({ compositionName }) {
    const activeComposition = compositions[compositionName];

    return (
      <section>
        <h1 style={{ color: "white" }}> Compositions</h1>
        <Menu
          items={Object.keys(compositions).map(key => [
            key,
            `/compositions/${key}`
          ])}
        />
        {activeComposition && (
          <CompositionPreview composition={activeComposition} />
        )}
      </section>
    );
  }
}

export default Compositions;
