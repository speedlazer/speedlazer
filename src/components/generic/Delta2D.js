import { rotX, rotY } from "src/lib/rotation";

const Delta2D = "Delta2D";

Crafty.c(Delta2D, {
  required: "2D",

  properties: {
    drx: {
      set: function(value) {
        const drx = value - this._drx;
        const [x, y] = rotX(this, drx);
        this.shift(x, y);
        this._drx = value;
      },
      // getter for the `drx` property
      get: function() {
        // return the cached dx value
        return this._drx;
      },

      // make the property show up in property enumerations
      enumerable: true,
      // property shouldn't be deletable
      configurable: false
    },

    _drx: {
      // set the initial value to 0
      value: 0,
      // it's a mutable property
      writable: true,
      // hide the property from property enumerations
      enumerable: false,
      // property shouldn't be deletable
      configurable: false
    },
    dry: {
      set: function(value) {
        const dry = value - this._dry;
        const [x, y] = rotY(this, dry);
        this.shift(x, y);
        this._dry = value;
      },
      // getter for the `dy` property
      get: function() {
        // return the cached dy value
        return this._dry;
      },

      // make the property show up in property enumerations
      enumerable: true,
      // property shouldn't be deletable
      configurable: false
    },

    _dry: {
      // set the initial value to 0
      value: 0,
      // it's a mutable property
      writable: true,
      // hide the property from property enumerations
      enumerable: false,
      // property shouldn't be deletable
      configurable: false
    },

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

export default Delta2D;
