import "../lib/crafty";
const Crafty = window.Crafty;
delete window["Crafty"];

Crafty.fn.forEach = function(iterator) {
  this.each(function(index) {
    iterator(this, index);
  });
};

export default Crafty;
