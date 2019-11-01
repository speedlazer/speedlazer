import { h, Component } from "preact";
import { Title } from "../../components/Title";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
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

class Patterns extends Component {
  state = { difficulty: 0, collisionType: null };

  buttonClick = difficulty => () => {
    this.setState(state => ({ ...state, difficulty }));
  };

  render({ pattern }, { difficulty, collisionType }) {
    const activePattern = patterns[pattern];

    const collisionTypes = patternCollisionTypes(activePattern);
    return (
      <section>
        <Title>Patterns</Title>
        <Divider>
          <Menu
            items={Object.keys(patterns).map(key => [key, `/patterns/${key}`])}
          />
          <div>
            <div>
              <button onClick={this.buttonClick(0.0)}>Easy</button>
              <button onClick={this.buttonClick(0.25)}>Medium</button>
              <button onClick={this.buttonClick(0.75)}>Hard</button>
              <button onClick={this.buttonClick(1.0)}>Nightmare</button>
            </div>
            {collisionTypes && (
              <Menu
                horizontal={true}
                items={[
                  [
                    "default",
                    () => this.setState(s => ({ ...s, collissionType: null }))
                  ]
                ].concat(
                  collisionTypes.map(type => [
                    type,
                    () => this.setState(s => ({ ...s, collisionType: type }))
                  ])
                )}
              />
            )}
            {activePattern && (
              <BulletPatternPreview
                pattern={activePattern}
                difficulty={difficulty}
                collisionType={collisionType}
              />
            )}
          </div>
        </Divider>
      </section>
    );
  }
}

export default Patterns;
