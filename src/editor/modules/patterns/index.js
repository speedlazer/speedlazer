import { h, Component } from "preact";
import { Title } from "../../components/Title";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import BulletPatternPreview from "./BulletPatternPreview";
import patterns from "src/data/patterns";

class Patterns extends Component {
  state = { difficulty: 0 };

  buttonClick = difficulty => () => {
    this.setState(state => ({ ...state, difficulty }));
  };

  render({ pattern }, { difficulty }) {
    const activePattern = patterns[pattern];
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
            {activePattern && (
              <BulletPatternPreview
                pattern={activePattern}
                difficulty={difficulty}
              />
            )}
          </div>
        </Divider>
      </section>
    );
  }
}

export default Patterns;
