import { Menu } from "../../components/Menu";
import { h, Component } from "preact";
import { CompositionPreview } from "./components/CompositionPreview";
import compositions from "src/editor/data/compositions";

class Compositions extends Component {
  render({ file, compositionName }) {
    const activeFile =
      compositions.find(m => m.name === file) || compositions[0];
    const activeComposition = compositionName
      ? activeFile.content[compositionName]
      : null;

    return (
      <section>
        <h1 style={{ color: "white" }}> Compositions</h1>
        <Menu
          items={compositions.map(map => [
            map.name,
            `/compositions/${map.name}`
          ])}
        />
        <Menu
          items={Object.keys(activeFile.content).map(key => [
            key,
            `/compositions/${activeFile.name}/${key}`
          ])}
        />
        {activeComposition && (
          <CompositionPreview
            file={activeFile.content}
            composition={activeComposition}
          />
        )}
      </section>
    );
  }
}

export default Compositions;
