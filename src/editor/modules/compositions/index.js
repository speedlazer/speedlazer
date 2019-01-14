import { CompositionPreview } from "./components/CompositionPreview";
import { Menu } from "../../components/Menu";
import { h } from "preact";
import compositions from "src/data/compositions";

const Compositions = ({ compositionName, frameName }) => {
  const activeComposition = compositions[compositionName];

  return (
    <section>
      <h1 style={{ color: "white" }}>Compositions</h1>
      <Menu
        items={Object.keys(compositions).map(key => [
          key,
          `/compositions/${key}`
        ])}
      />
      {activeComposition &&
        activeComposition.frames && (
          <Menu
            items={Object.keys(activeComposition.frames).map(key => [
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
        />
      )}
    </section>
  );
};

export default Compositions;
