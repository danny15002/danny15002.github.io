(function () {
// if Asteroids === undefined = {}
  window.Asteroids = window.Asteroids || {};

  var Utils = window.Asteroids.Utils = {};

  var Surrogate = function () {};

  Utils.inherits = function(Subclass, SuperClass) {
    Surrogate.prototype = SuperClass.prototype;
    Subclass.prototype = new Surrogate();
    Subclass.prototype.constructor = Subclass;
  };

  Utils.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

})();
