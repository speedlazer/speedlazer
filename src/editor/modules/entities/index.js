import { EntityPreview } from "./components/EntityPreview";
import { Menu } from "../../components/Menu";
import { h } from "preact";
import entities from "src/data/entities";

const Entities = ({ entity, stateName }) => {
  const activeEntity = entities.find(e => e.name === entity);

  return (
    <section>
      <h1 style={{ color: "white" }}>Entities</h1>
      <Menu items={entities.map(({ name }) => [name, `/entities/${name}`])} />
      {activeEntity &&
        activeEntity.states && (
          <Menu
            items={["default", ...Object.keys(activeEntity.states)].map(key => [
              key,
              `/entities/${entity}/states/${key}`
            ])}
          />
        )}
      {entity && <EntityPreview entity={entity} state={stateName} />}
    </section>
  );
};

export default Entities;
