Crafty.c("Delta2D", {

  init() {
    this.requires("2D");
    this._defineDelta2DProperties()
  },

  // This is Crafty 0.8.0 syntax.
  // This can be greatly simplified in the new (yet unreleased) version
  // of crafty, by using 'required:' and 'properties:' keys

  _defineDelta2DProperties: function () {
    for (const prop in this._delta2D_property_definitions){
      Object.defineProperty(this, prop, this._delta2D_property_definitions[prop]);
    }
  },

  _delta2D_property_definitions: {
    dx: {
      set: function(value) {
        this.shift(value - this._dx);
        this._dx = value;
      },
      // getter for the `dx` property
      get: function() {
        // return the cached dx value
        return this._dx;
      },

      // make the property show up in property enumerations
      enumerable: true,
      // property shouldn't be deletable
      configurable: false
    },

    _dx: {
      // set the initial value to 0
      value: 0,
      // it's a mutable property
      writable: true,
      // hide the property from property enumerations
      enumerable: false,
      // property shouldn't be deletable
      configurable: false
    },

    dy: {
      set: function(value) {
        this.shift(0, value - this._dy);
        this._dy = value;
      },
      // getter for the `dy` property
      get: function() {
        // return the cached dy value
        return this._dy;
      },

      // make the property show up in property enumerations
      enumerable: true,
      // property shouldn't be deletable
      configurable: false
    },

    _dy: {
      // set the initial value to 0
      value: 0,
      // it's a mutable property
      writable: true,
      // hide the property from property enumerations
      enumerable: false,
      // property shouldn't be deletable
      configurable: false
    }
  }
});
