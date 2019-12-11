import { h, Component } from "preact";
import { Title } from "../../components/Title";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Text } from "../../components/Text";
import BulletPatternPreview from "./BulletPatternPreview";
import weapons from "src/data/weapons";

const weaponCollisionTypes = activeWeapon =>
  !activeWeapon
    ? []
    : Object.values(activeWeapon.spawnables || {})
        .reduce(
          (acc, spawnable) =>
            acc.concat(Object.keys(spawnable.collisions || {})),
          []
        )
        .filter((e, i, l) => l.indexOf(e) === i);

const DEFAULT_STATE = {
  difficulty: 0,
  collisionType: null,
  moveBlue: false,
  swapped: false
};

const STORAGE_KEY = "editor-weapon-settings";
const storeState = newState =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));

const storedState = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
};

class Weapons extends Component {
  state = { ...DEFAULT_STATE, ...storedState() };

  buttonClick = difficulty => () => {
    this.setState(state => ({ ...state, difficulty }));
  };

  render({ weapon }, { difficulty, collisionType, moveBlue, swapped }) {
    const activeWeapon = weapons[weapon];

    storeState(this.state);
    const collisionTypes = weaponCollisionTypes(activeWeapon);
    return (
      <section>
        <Title>Weapons</Title>
        <Divider>
          <Menu
            items={Object.keys(weapons).map(key => [key, `/weapons/${key}`])}
          />
          {activeWeapon && (
            <div>
              <div>
                <button onClick={this.buttonClick(0.0)}>Easy</button>
                <button onClick={this.buttonClick(0.25)}>Medium</button>
                <button onClick={this.buttonClick(0.75)}>Hard</button>
                <button onClick={this.buttonClick(1.0)}>Nightmare</button>
                <Text>{collisionType}</Text>
                <button
                  onClick={() =>
                    this.setState(state => ({
                      ...state,
                      moveBlue: !state.moveBlue
                    }))
                  }
                >
                  {moveBlue ? "Stop" : "Move"} Blue
                </button>
                <button
                  onClick={() =>
                    this.setState(state => ({
                      ...state,
                      swapped: !state.swapped
                    }))
                  }
                >
                  Swap Blue {"<->"} Red
                </button>
              </div>
              {collisionTypes && (
                <Menu
                  horizontal={true}
                  items={[
                    [
                      "default",
                      () => this.setState(s => ({ ...s, collisionType: null }))
                    ]
                  ].concat(
                    collisionTypes.map(type => [
                      type,
                      () => this.setState(s => ({ ...s, collisionType: type }))
                    ])
                  )}
                />
              )}
              <BulletPatternPreview
                weapon={activeWeapon}
                difficulty={difficulty}
                collisionType={collisionType}
                moveBlue={moveBlue}
                swapped={swapped}
              />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Weapons;
