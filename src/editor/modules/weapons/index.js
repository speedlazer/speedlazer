import { h, Component } from "preact";
import { Title } from "editor/components/Title";
import { Menu } from "editor/components/Menu";
import { CentralMenu } from "editor/components/CentralMenu";
import { Source } from "editor/components/Source";
import { Divider } from "editor/components/Divider";
import { Text } from "editor/components/Text";
import BulletPatternPreview from "./BulletPatternPreview";
import { weapons } from "data";

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
  firing: false,
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
    this.setState(state => ({ ...state, difficulty, firing: true }));
  };

  toggleWeapon = () => {
    this.setState(state => ({ ...state, firing: !state.firing }));
  };

  render({ weapon }, { firing, difficulty, collisionType, moveBlue, swapped }) {
    const activeWeapon = weapons(weapon);

    storeState(this.state);
    const collisionTypes = weaponCollisionTypes(activeWeapon);
    return (
      <section>
        <Title>Weapons{weapon && ` - ${weapon}`}</Title>
        <Divider>
          <CentralMenu hoverHide={activeWeapon} root="weapons" />
          {activeWeapon && (
            <div>
              <div>
                <button onClick={this.toggleWeapon}>
                  {firing ? "Stop" : "Start"}
                </button>
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
                firing={firing}
                difficulty={difficulty}
                collisionType={collisionType}
                moveBlue={moveBlue}
                swapped={swapped}
              />
              <Source code={activeWeapon} />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Weapons;
