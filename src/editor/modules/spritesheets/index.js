import { h, Component } from "preact";
import { Divider } from "../../components/Divider";
import { Grid } from "../../components/Grid";
import { LayerBox } from "../../components/LayerBox";
import { Menu } from "../../components/Menu";
import { ScrollBox } from "../../components/ScrollBox";
import { Text } from "../../components/Text";
import { Highlight } from "./components/Highlight";
import { Title } from "../../components/Title";
import spritesheets from "src/data/spritesheets";
import { route } from "preact-router";

class Spritesheets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null,
      clickCoord: null
    };
  }

  onLayerClick = event => {
    const activeMap =
      spritesheets.find(m => m.name === this.props.map) || spritesheets[0];
    const tileWidth = activeMap.map.tile;
    const tileHeight = activeMap.map.tileh;

    const tileX = event.offsetX / tileWidth;
    const tileY = event.offsetY / tileHeight;

    this.setState(s => ({
      ...s,
      clickCoord: { x: Math.floor(tileX), y: Math.floor(tileY) }
    }));

    const sprite = Object.entries(activeMap.map.map).find(
      ([, [x, y, w, h]]) =>
        tileX > x && tileX < x + w && tileY > y && tileY < y + h
    );
    if (sprite) {
      route(`/editor/sprites/${activeMap.name}/${sprite[0]}`, true);
    }
  };

  render({ map, activeSprite }, { width, height, clickCoord }) {
    const activeMap = spritesheets.find(m => m.name === map) || spritesheets[0];
    const highlight = (activeSprite && activeMap.map.map[activeSprite]) || null;

    const tileWidth = activeMap.map.tile;
    const tileHeight = activeMap.map.tileh;
    return (
      <section>
        <Title>
          Spritesheets - {activeMap.name} {width}x{height}
        </Title>
        <Divider>
          <div>
            <Menu
              items={spritesheets.map(map => [
                map.name,
                `/sprites/${map.name}`
              ])}
            />
            <Menu
              items={Object.keys(activeMap.map.map).map(key => [
                key,
                `/sprites/${activeMap.name}/${key}`
              ])}
            />
          </div>
          <div>
            {highlight && (
              <Text>
                {activeSprite} - {tileWidth * highlight[2]} x{" "}
                {tileHeight * highlight[3]}
              </Text>
            )}
            {clickCoord && (
              <Text>
                Clicked at: [{clickCoord.x}, {clickCoord.y}]
              </Text>
            )}
            <ScrollBox height={"80vh"} width={"80vw"}>
              <LayerBox
                width={width}
                height={height}
                onClick={this.onLayerClick}
              >
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
          </div>
        </Divider>
      </section>
    );
  }
}

export default Spritesheets;
