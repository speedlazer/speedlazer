const WebGLParticles = "WebGLParticles";

class ParticleBuffer {
  constructor(context, stride, attributes) {
    this.context = context;
    this.attributes = attributes;
    this.stride = stride;

    this.array_size = 16;
    this.max_size = 4096;
    this.render_size = 0;

    this._attributeArray = new Float32Array(this.array_size * this.stride);
    this._attributeBuffer = this.context.createBuffer();

    this.active = true;
  }

  reactivate() {
    this.active = true;
    this.render_size = 0;
  }

  deactivate() {
    this.active = false;
  }

  growArrays(size) {
    this.render_size = Math.min(size, this.max_size);

    if (this.array_size >= this.max_size) return;
    if (this.array_size >= size) return;

    const newsize = Math.min(size, this.max_size);

    const newAttributeArray = new Float32Array(newsize * this.stride);
    newAttributeArray.set(this._attributeArray);

    this._attributeArray = newAttributeArray;
    this.array_size = newsize;
  }

  writeParticle(pi, particle) {
    const attributes = this.attributes;
    let offset = pi * this.stride;

    for (let ai = 0; ai < attributes.length; ai++) {
      for (let api = 0; api < attributes[ai].width; api++) {
        this._attributeArray[offset] = particle[attributes[ai].name][api];
        offset++;
      }
    }
  }

  draw() {
    const gl = this.context;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._attributeBuffer);
    const attributes = this.attributes;
    // Process every attribute
    for (var i = 0; i < attributes.length; i++) {
      let a = attributes[i];
      gl.vertexAttribPointer(
        a.location,
        a.width,
        a.type,
        false,
        this.stride * a.bytes,
        a.offset * a.bytes
      );
    }

    gl.bufferData(gl.ARRAY_BUFFER, this._attributeArray, gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, this.render_size);
  }
}

class RenderProgramWrapper {
  constructor(layer, shader) {
    this.shader = shader;
    this.layer = layer;
    this.context = layer.context;
    this.draw = function() {};

    this.array_size = 0;
    this.max_size = 96;
  }

  // Takes an array of attributes; see WebGLLayer's getProgramWrapper method
  initAttributes(attributes) {
    this.attributes = attributes;
    this._attribute_table = {};
    var offset = 0;
    for (var i = 0; i < attributes.length; i++) {
      var a = attributes[i];
      this._attribute_table[a.name] = a;

      a.bytes = a.bytes || Float32Array.BYTES_PER_ELEMENT;
      a.type = a.type || this.context.FLOAT;
      a.offset = offset;
      a.location = this.context.getAttribLocation(this.shader, a.name);

      this.context.enableVertexAttribArray(a.location);

      offset += a.width;
    }

    // Stride is the full width including the last set
    this.stride = offset;

    // Create attribute array of correct size to hold max elements

    this.buffers = [];
  }

  // Add an entity that needs to be rendered by this program
  // Needs to be assigned an index in the buffer
  registerEntity(e) {
    const staleBuffer = this.buffers.find(b => b.active === false);
    if (staleBuffer === undefined) {
      if (this.buffers.length >= this.max_size) {
        throw "Number of entities exceeds maximum limit.";
      }

      const newBuffer = new ParticleBuffer(
        this.context,
        this.stride,
        this.attributes
      );
      this.buffers.push(newBuffer);
      e.particleBuffer = newBuffer;
    } else {
      staleBuffer.reactivate();
      e.particleBuffer = staleBuffer;
    }
  }

  // remove an entity; allow its buffer index to be reused
  unregisterEntity(e) {
    e.particleBuffer.deactivate();
    e.particleBuffer = null;
  }

  resetRegistry() {
    this.buffers = [];
  }

  setCurrentEntity(ent) {
    this.drawBuffers.push(ent.particleBuffer);
  }

  // Called before a batch of entities is prepped for rendering
  switchTo() {
    var gl = this.context;
    gl.useProgram(this.shader);
    this.drawBuffers = [];
    this.hasTime = false;
  }

  // Sets a texture
  setTexture(texture_obj) {
    // Only needs to be done once
    if (this.texture_obj !== undefined) return;
    // Set the texture buffer to use
    texture_obj.setToProgram(this.shader, "uSampler", "uTextureDimensions");
    this.texture_obj = texture_obj;
  }

  // Writes data from the attribute and index arrays to the appropriate buffers, and then calls drawElements.
  renderBatch() {
    // For now, special case the need for texture objects
    var t = this.texture_obj;
    if (t && t.unit === null) {
      this.layer.texture_manager.bindTexture(t);
    }

    for (let i = 0; i < this.drawBuffers.length; i++) {
      if (this.drawBuffers[i].active) {
        this.drawBuffers[i].draw();
      }
    }
  }

  setViewportUniforms(viewport) {
    var gl = this.context;
    gl.useProgram(this.shader);
    gl.uniform4f(
      this.shader.viewport,
      -viewport._x,
      -viewport._y,
      viewport._w,
      viewport._h
    );
  }
}

Crafty.c(WebGLParticles, {
  /**@
   * #.context
   * @comp WebGL
   * @kind Property
   *
   * The webgl context this entity will be rendered to.
   */
  init: function() {
    this.requires("Renderable");
    // Attach to webgl layer
    if (!this._customLayer) {
      this._attachToLayer(Crafty.s("DefaultWebGLLayer"));
    }
  },

  remove: function() {
    this._detachFromLayer();
  },

  // Cache the various objects and arrays used in draw
  drawVars: {
    type: "webgl",
    pos: {},
    ctx: null,
    coord: [0, 0, 0, 0],
    co: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
  },

  /**@
   * #.draw
   * @comp WebGL
   * @kind Method
   * @private
   *
   * @sign public this .draw()
   *
   * An internal method to draw the entity on the webgl canvas element. Rather then rendering directly, it writes relevent information into a buffer to allow batch rendering.
   */
  draw: function() {
    if (!this.ready) return;

    var pos = this.drawVars.pos;
    pos._x = this._x;
    pos._y = this._y;
    pos._w = this._w;
    pos._h = this._h;

    var coord = this.__coord || [0, 0, 0, 0];
    var co = this.drawVars.co;
    co.x = coord[0];
    co.y = coord[1];
    co.w = coord[2];
    co.h = coord[3];

    // Handle flipX, flipY
    // (Just swap the positions of e.g. x and x+w)
    if (this._flipX) {
      co.x = co.x + co.w;
      co.w = -co.w;
    }
    if (this._flipY) {
      co.y = co.y + co.h;
      co.h = -co.h;
    }

    //Draw entity
    var gl = this._drawContext;
    this.drawVars.gl = gl;
    var prog = (this.drawVars.program = this.program);

    // The program might need to refer to the current element's index
    prog.setCurrentEntity(this);

    // This should only need to handle *specific* attributes!
    this.trigger("Draw", this.drawVars);

    return this;
  },

  _establishShader: function(compName, shader) {
    if (this._drawLayer.programs[compName] === undefined) {
      const compiledShader = this._drawLayer._makeProgram(shader);
      var gl = this._drawContext;
      compiledShader.time = gl.getUniformLocation(
        compiledShader,
        "uTimeOffset"
      );
      compiledShader.spriteCoords = gl.getUniformLocation(
        compiledShader,
        "uSpriteCoords"
      );

      const program = new RenderProgramWrapper(this._drawLayer, compiledShader);
      program.name = compName;
      program.initAttributes(shader.attributeList);
      program.draw = shader.drawCallback;
      program.setViewportUniforms(this._drawLayer._viewportRect());
      this.program = program;
      this._drawLayer.programs[program.name] = program;
    } else {
      this.program = this._drawLayer.programs[compName];
    }

    // Needs to know where in the big array we are!
    this.program.registerEntity(this);
    // Shader program means ready
    this.ready = true;
  }
});

export default WebGLParticles;
