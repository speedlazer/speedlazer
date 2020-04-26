import { h, Component } from "preact";
import { GamePreview } from "./GamePreview";
import { Setting } from "editor/components/Setting";
import { Menu } from "editor/components/Menu";
import { Divider } from "editor/components/Divider";
import { Title } from "editor/components/Title";
import { BarChart } from "editor/components/BarChart";
import gameStructure from "src/scripts";

const DEFAULT_STATE = {
  stats: [],
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

  setStats = stats => {
    this.setState(s => ({ ...s, stats }));
  };

  render({ stage }, { invincible, stats }) {
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

            {stage && (
              <GamePreview
                stage={stage}
                invincible={invincible}
                onStats={this.setStats}
              />
            )}
            <BarChart data={stats} />
          </div>
        </Divider>
      </section>
    );
  }
}

export default Game;