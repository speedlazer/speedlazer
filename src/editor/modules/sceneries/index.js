import { SceneryPreview } from "./components/SceneryPreview";
import sceneries from "src/data/sceneries";
import { Menu } from "../../components/Menu";
import { h } from "preact";

const Sceneries = ({ scenery }) => {
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
      {activeScenery && <SceneryPreview scenery={scenery} />}
    </section>
  );
};

export default Sceneries;
