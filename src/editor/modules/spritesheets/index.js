import { Divider } from "../../components/Divider";
import { Grid } from "../../components/Grid";
import { LayerBox } from "../../components/LayerBox";
import { Menu } from "../../components/Menu";
import { ScrollBox } from "../../components/ScrollBox";
import { Highlight } from "./components/Highlight";
import { h, Component } from "preact";
import spritesheets from "src/data/spritesheets";

class Spritesheets extends Component {
  constructor() {
    super();
    this.state = {
      width: null,
      height: null
    };
  }

  render({ map, activeSprite }, { width, height }) {
    const activeMap = spritesheets.find(m => m.name === map) || spritesheets[0];
    const highlight = (activeSprite && activeMap.map.map[activeSprite]) || null;

    const tileWidth = activeMap.map.tile;
    const tileHeight = activeMap.map.tileh;
    return (
      <section>
        <h1 style={{ color: "white" }}>
          Spritesheets - {activeMap.name} {width}x{height}
        </h1>
        <Menu
          items={spritesheets.map(map => [map.name, `/sprites/${map.name}`])}
        />
        <Divider>
          <div>
            <Menu
              items={Object.keys(activeMap.map.map).map(key => [
                key,
                `/sprites/${activeMap.name}/${key}`
              ])}
            />
          </div>
          <ScrollBox height={"100%"} width={"80vw"}>
            <LayerBox width={width} height={height}>
              <img
                src={activeMap.image}
                onLoad={e => {
                  this.setState({
                    width: e.target.naturalWidth,
                    height: e.target.naturalHeight
                  });
                }}
              />
              {highlight && (
                <Highlight
                  highlight={highlight}
                  tileWidth={tileWidth}
                  tileHeight={tileHeight}
                />
              )}
              <Grid width={tileWidth} height={tileHeight} />
            </LayerBox>
          </ScrollBox>
        </Divider>
      </section>
    );
  }
}

export default Spritesheets;
