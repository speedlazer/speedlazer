import { BackgroundPreview } from "./components/BackgroundPreview";
import backgrounds from "src/data/backgrounds";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import { Title } from "../../components/Title";
import { h, Component } from "preact";

class Backgrounds extends Component {
  render({ background }) {
    const activeBackground = backgrounds[background];
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
            <BackgroundPreview background={activeBackground} />
          )}
        </Divider>
      </section>
    );
  }
}

export default Backgrounds;
