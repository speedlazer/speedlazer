import { h, Component } from "preact";
import { GamePreview } from "./GamePreview";
import { Setting } from "editor/components/Setting";
import { Menu } from "editor/components/Menu";
import { Text } from "editor/components/Text";
import { Divider } from "editor/components/Divider";
import { Title } from "editor/components/Title";
import { BarChart } from "editor/components/BarChart";
import gameStructure from "src/scripts";

const DEFAULT_STATE = {
  stats: [],
  invincible: false,
  autoContinue: false
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

  updateAutoContinue = checked => {
    this.setState(s => ({ ...s, autoContinue: checked }));
  };

  setStats = stats => {
    this.setState(s => ({ ...s, stats }));
  };

  render({ stage }, { invincible, stats, autoContinue }) {
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
              <Text>Tags: {Object.keys(activeStage.tags).join(", ")}</Text>
              <GamePreview
                stage={stage}
                invincible={invincible}
                autoContinue={autoContinue}
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
