import { h, Component } from "preact";
import { GamePreview } from "./GamePreview";
import { Setting } from "../../components/Setting";
import { Menu } from "../../components/Menu";
import { Text } from "../../components/Text";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import { BarChart } from "../../components/BarChart";
import gameStructure from "../../../scripts";

const DEFAULT_STATE = {
  stats: [],
  invincible: false,
  autoContinue: false,
  tenLifes: false
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

  updateTenLifes = checked => {
    this.setState(s => ({ ...s, tenLifes: checked }));
  };

  updateAutoContinue = checked => {
    this.setState(s => ({ ...s, autoContinue: checked }));
  };

  setStats = stats => {
    this.setState(s => ({ ...s, stats }));
  };

  render({ stage }, { invincible, stats, autoContinue, tenLifes }) {
    storeState(this.state);
    const activeStage = gameStructure.find(({ name }) => name === stage);
    return (
      <section>
        <Title>Game{stage && ` - ${stage}`}</Title>
        <Divider>
          <Menu
            hoverHide={stage}
            items={gameStructure.map(({ name }) => [name, `/game/${name}`])}
          />
          {stage && (
            <div>
              <Setting checked={invincible} onCheck={this.updateInvincible}>
                Invincible
              </Setting>
              <Setting checked={autoContinue} onCheck={this.updateAutoContinue}>
                Continue
              </Setting>
              <Setting checked={tenLifes} onCheck={this.updateTenLifes}>
                10 extra lifes
              </Setting>
              <Text>Tags: {Object.keys(activeStage.tags).join(", ")}</Text>
              <GamePreview
                stage={stage}
                invincible={invincible}
                autoContinue={autoContinue}
                extraLifes={tenLifes ? 10 : 0}
                onStats={this.setStats}
              />
              <BarChart data={stats} />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Game;
