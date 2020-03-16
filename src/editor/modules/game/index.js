import { h } from "preact";
import { GamePreview } from "./GamePreview";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import gameStructure from "src/scripts";

const Game = ({ stage }) => (
  <section>
    <Title>Game{stage && ` - ${stage}`}</Title>
    <Divider>
      <Menu items={gameStructure.map(({ name }) => [name, `/game/${name}`])} />
      <div>{stage && <GamePreview stage={stage} />}</div>
    </Divider>
  </section>
);

export default Game;
