import { h, Component } from "preact";
import { GamePreview } from "./GamePreview";
import { Setting } from "../../components/Setting";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import gameStructure from "src/scripts";

const DEFAULT_STATE = {
  invincible: false
};

const STORAGE_KEY = "editor-game-settings";
const storeState = newState =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

const storedState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...DEFAULT_STATE,
      ...storedState()
    };
  }

  updateInvincible = checked => {
    this.setState(s => ({ ...s, invincible: checked }));
  };

  render({ stage }, { invincible }) {
    storeState(this.state);
    return (
      <section>
        <Title>Game{stage && ` - ${stage}`}</Title>
        <Divider>
          <Menu
            hoverHide={stage}
            items={gameStructure.map(({ name }) => [name, `/game/${name}`])}
          />
          <div>
            <Setting checked={invincible} onCheck={this.updateInvincible}>
              Invincible
            </Setting>

            {stage && <GamePreview stage={stage} invincible={invincible} />}
          </div>
        </Divider>
      </section>
    );
  }
}

export default Game;
