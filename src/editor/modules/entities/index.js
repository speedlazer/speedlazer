import { h } from "preact";
import { EntityPreview } from "./components/EntityPreview";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import entities from "src/data/entities";

const Entities = ({
  entity,
  stateName = "default",
  habitatName = "default"
}) => {
  const activeEntity = entities.find(e => e.name === entity);

  return (
    <section>
      <Title>Entities</Title>
      <Divider>
        <Menu items={entities.map(({ name }) => [name, `/entities/${name}`])} />
        <div>
          {activeEntity && activeEntity.states && (
            <Menu
              horizontal={true}
              items={["default", ...Object.keys(activeEntity.states)].map(
                key => [key, `/entities/${entity}/states/${key}/${habitatName}`]
              )}
            />
          )}
          {activeEntity && activeEntity.habitats && (
            <Menu
              horizontal={true}
              items={[
                "default",
                ...Object.values(activeEntity.habitats).map(h => h.name)
              ].map(key => [
                key,
                `/entities/${entity}/states/${stateName}/${key}`
              ])}
            />
          )}
          {entity && (
            <EntityPreview
              entity={entity}
              state={stateName}
              habitat={habitatName}
            />
          )}
        </div>
      </Divider>
    </section>
  );
};

export default Entities;
