const component = "Delta2D";

Crafty.c(component, {
  required: "2D",

  properties: {
    dx: {
      set: function(value) {
        this.shift(value - this._dx, 0);
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

export default component;
