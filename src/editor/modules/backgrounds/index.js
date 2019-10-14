import { BackgroundPreview } from "./components/BackgroundPreview";
import backgrounds from "src/data/backgrounds";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import { Text } from "../../components/Text";
import { h, Component } from "preact";

class Backgrounds extends Component {
  state = {
    backgroundLimit: 0
  };

  increaseLimit = () => {
    this.setState(s => ({
      ...s,
      backgroundLimit: s.backgroundLimit + 1
    }));
  };

  render({ background, checkpoint }, { backgroundLimit }) {
    const activeBackground = backgrounds[background];
    console.log(checkpoint);
    return (
      <section>
        <Title>Backgrounds</Title>
        <Divider>
          <Menu
            items={Object.keys(backgrounds).map(key => [
              key,
              `/backgrounds/${key}`
            ])}
          />
          {activeBackground && (
            <div>
              <div>
                <Text>{backgroundLimit}</Text>
                <button
                  onClick={this.increaseLimit}
                  disabled={
                    activeBackground.checkpoints.length <= backgroundLimit
                  }
                >
                  Increase allowed checkpoint
                </button>
              </div>
              <Menu
                horizontal={true}
                items={activeBackground.checkpoints.map((a, i) => [
                  `${i + 1}`,
                  `/backgrounds/${background}/checkpoints/${i}`
                ])}
              />
              <BackgroundPreview
                background={activeBackground}
                activeCheckpoint={checkpoint ? parseInt(checkpoint, 10) : 0}
                backgroundLimit={backgroundLimit}
              />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Backgrounds;
