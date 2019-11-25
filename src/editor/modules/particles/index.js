import { h, Component } from "preact";
import { Title } from "../../components/Title";
import { Menu } from "../../components/Menu";
import { Divider } from "../../components/Divider";
import ParticleEmitterPreview from "./ParticleEmitterPreview";
import particles from "src/data/particles";

class Particles extends Component {
  render({ particles: p }) {
    const activeParticles = particles[p];

    return (
      <section>
        <Title>Particles</Title>
        <Divider>
          <Menu
            items={Object.keys(particles).map(key => [
              key,
              `/particles/${key}`
            ])}
          />
          {activeParticles && (
            <div>
              <ParticleEmitterPreview emitter={activeParticles} />
            </div>
          )}
        </Divider>
      </section>
    );
  }
}

export default Particles;
