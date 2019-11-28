const WebGLParticles = "WebGLParticles";

function RenderProgramWrapper(layer, shader) {
  this.shader = shader;
  this.layer = layer;
  this.context = layer.context;
  this.draw = function() {};

  this.array_size = 16;
  this.max_size = 4096;
  this._indexArray = new Uint16Array(this.array_size);
  this._indexBuffer = layer.context.createBuffer();
}

RenderProgramWrapper.prototype = {
  // Takes an array of attributes; see WebGLLayer's getProgramWrapper method
  initAttributes: function(attributes) {
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
    this._attributeArray = new Float32Array(this.array_size * this.stride);
    this._attributeBuffer = this.context.createBuffer();
    this._registryHoles = [];
    this._registrySize = 0;
  },

  // increase the size of the typed arrays
  // does so by creating a new array of that size and copying the existing one into it
  growArrays: function(size) {
    if (this.array_size >= this.max_size) return;
    if (this.array_size >= size) return;

    var newsize = Math.min(size, this.max_size);

    var newAttributeArray = new Float32Array(newsize * this.stride);
    var newIndexArray = new Uint16Array(newsize);

    newAttributeArray.set(this._attributeArray);
    newIndexArray.set(this._indexArray);

    this._attributeArray = newAttributeArray;
    this._indexArray = newIndexArray;
    this.array_size = newsize;
  },

  // Add an entity that needs to be rendered by this program
  // Needs to be assigned an index in the buffer
  registerEntity: function(e) {
    if (this._registryHoles.length === 0) {
      if (this._registrySize >= this.max_size) {
        throw "Number of entities exceeds maximum limit.";
      } else if (this._registrySize >= this.array_size) {
        this.growArrays(2 * this.array_size);
      }
      e._glBufferIndex = this._registrySize;
      this._registrySize++;
    } else {
      e._glBufferIndex = this._registryHoles.pop();
    }
  },

  // remove an entity; allow its buffer index to be reused
  unregisterEntity: function(e) {
    if (typeof e._glBufferIndex === "number")
      this._registryHoles.push(e._glBufferIndex);
    e._glBufferIndex = null;
  },

  resetRegistry: function() {
    this._maxElement = 0;
    this._registryHoles.length = 0;
  },

  setCurrentEntity: function(ent) {
    // offset is 4 * buffer index, because each entity has 4 vertices
    this.ent_offset = ent._glBufferIndex;
    this.ent = ent;
  },

  // Called before a batch of entities is prepped for rendering
  switchTo: function() {
    var gl = this.context;
    gl.useProgram(this.shader);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._attributeBuffer);
    var a,
      attributes = this.attributes;
    // Process every attribute
    for (var i = 0; i < attributes.length; i++) {
      a = attributes[i];
      gl.vertexAttribPointer(
        a.location,
        a.width,
        a.type,
        false,
        this.stride * a.bytes,
        a.offset * a.bytes
      );
    }

    // For now, special case the need for texture objects
    var t = this.texture_obj;
    if (t && t.unit === null) {
      this.layer.texture_manager.bindTexture(t);
    }

    this.index_pointer = 0;
  },

  // Sets a texture
  setTexture: function(texture_obj) {
    // Only needs to be done once
    if (this.texture_obj !== undefined) return;
    // Set the texture buffer to use
    texture_obj.setToProgram(this.shader, "uSampler", "uTextureDimensions");
    this.texture_obj = texture_obj;
  },

  // Writes data from the attribute and index arrays to the appropriate buffers, and then calls drawElements.
  renderBatch: function() {
    var gl = this.context;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._attributeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._attributeArray, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indexArray, gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, this.index_pointer);
  },

  setViewportUniforms: function(viewport) {
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

  // Fill in the attribute with the given arguments, cycling through the data if necessary
  // If the arguments provided match the width of the attribute, that means it'll fill the same values for each of the four vertices.
  // TODO determine if this abstraction is a performance hit!
  //writeVector: function(name) {
  //var a = this._attribute_table[name];
  //var stride = this.stride,
  //offset = a.offset + this.ent_offset * stride,
  //w = a.width;
  //var l = arguments.length - 1;
  //var data = this._attributeArray;

  //// Filling buffer should be cleaned up
  //for (var c = 0; c < w; c++) {
  //data[offset + stride + c] = arguments[((w + c) % l) + 1];
  //}
  //}
};

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
    const compiledShader = this._drawLayer._makeProgram(shader);
    var gl = this._drawContext;
    compiledShader.time = gl.getUniformLocation(compiledShader, "uTimeOffset");

    const program = new RenderProgramWrapper(this._drawLayer, compiledShader);
    program.name = compName;
    program.initAttributes(shader.attributeList);
    program.draw = shader.drawCallback;
    program.setViewportUniforms(this._drawLayer._viewportRect());
    this.program = program;
    this._drawLayer.programs[program.name] = program;

    // Needs to know where in the big array we are!
    this.program.registerEntity(this);
    // Shader program means ready
    this.ready = true;
  }
});

export default WebGLParticles;
