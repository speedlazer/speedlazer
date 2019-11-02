import { h, Component } from "preact";
import { Title } from "../../components/Title";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Text } from "../../components/Text";
import BulletPatternPreview from "./BulletPatternPreview";
import patterns from "src/data/patterns";

const patternCollisionTypes = activePattern =>
  !activePattern
    ? []
    : Object.values(activePattern.spawnables || {})
        .reduce(
          (acc, spawnable) =>
            acc.concat(Object.keys(spawnable.collisions || {})),
          []
        )
        .filter((e, i, l) => l.indexOf(e) === i);

const DEFAULT_STATE = {
  difficulty: 0,
  collisionType: null
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

class Patterns extends Component {
  state = { ...DEFAULT_STATE, ...storedState() };

  buttonClick = difficulty => () => {
    this.setState(state => ({ ...state, difficulty }));
  };

  render({ pattern }, { difficulty, collisionType }) {
    const activePattern = patterns[pattern];

    storeState(this.state);
    const collisionTypes = patternCollisionTypes(activePattern);
    return (
      <section>
        <Title>Patterns</Title>
        <Divider>
          <Menu
            items={Object.keys(patterns).map(key => [key, `/patterns/${key}`])}
          />
          {activePattern && (
            <div>
              <div>
                <button onClick={this.buttonClick(0.0)}>Easy</button>
                <button onClick={this.buttonClick(0.25)}>Medium</button>
                <button onClick={this.buttonClick(0.75)}>Hard</button>
                <button onClick={this.buttonClick(1.0)}>Nightmare</button>
                <Text>{collisionType}</Text>
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
                pattern={activePattern}
                difficulty={difficulty}
                collisionType={collisionType}
              />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Patterns;
