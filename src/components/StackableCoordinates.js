import Crafty from "../crafty";

const StackableCoordinates = "StackableCoordinates";

Crafty.c(StackableCoordinates, {
  required: "2D",

  init() {
    this.stackableProps = {};
    this.propertyStacks = {};
    this.uniqueBind("Move", this._updateBaseCoords);
  },

  createStackablePropertyFor(property, mainProperty) {
    if (this.stackableProps[property] !== undefined) return;
    if (this.propertyStacks[mainProperty]) {
      this.propertyStacks[mainProperty] = this.propertyStacks[
        mainProperty
      ].concat(property);
    } else {
      this.propertyStacks[mainProperty] = [mainProperty, property];
      this.stackableProps[mainProperty] = this[mainProperty];
    }
    this.stackableProps[property] = 0;

    Crafty.defineField(
      this,
      property,
      () => this.stackableProps[property],
      newValue => {
        this.stackableProps[property] = newValue;
        this.recalculateStackableProp(mainProperty);
      }
    );
  },

  recalculateStackableProp(mainProperty) {
    this._stackRecalc = true;
    this[mainProperty] = this.propertyStacks[mainProperty].reduce(
      (acc, prop) => acc + this.stackableProps[prop],
      0
    );
    this._stackRecalc = false;
  },

  applyStackableProperty(property, mainProperty) {
    this._stackRecalc = true;
    this.stackableProps[mainProperty] += this.stackableProps[property];
    this.stackableProps[property] = 0;
    this._stackRecalc = false;
  },

  _updateBaseCoords(e) {
    if (this._stackRecalc) return;
    this.stackableProps["x"] += this.x - e._x;
    this.stackableProps["y"] += this.y - e._y;
  }
});

export default StackableCoordinates;
