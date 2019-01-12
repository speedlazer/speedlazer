import { EntityPreview } from "./components/EntityPreview";
import { Menu } from "../../components/Menu";
import { h } from "preact";
import entities from "src/data/entities";

const Entities = ({ entity }) => (
  <section>
    <h1 style={{ color: "white" }}>Entities</h1>
    <Menu items={entities.map(({ name }) => [name, `/entities/${name}`])} />
    {entity && <EntityPreview entity={entity} />}
  </section>
);

export default Entities;
