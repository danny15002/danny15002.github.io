(function () {
  window.Asteroids = window.Asteroids || {};
  var Utils = window.Asteroids.Utils;

  var Asteroid = window.Asteroids.Asteroid = function (game) {
    Asteroids.MovingObject.call(this, {game: game});

    this.color = "blue";
    this.radius = 50;
    this.pos = [Utils.getRandomInt(0,200), Utils.getRandomInt(0,700)];
    this.vel = [Utils.getRandomInt(-12,12)/6, Utils.getRandomInt(-12,12)/6];
  };

  Utils.inherits(Asteroid, window.Asteroids.MovingObject);

  Asteroid.prototype.isDestroyed = function (otherMovingObject) {
    if ((this.radius + otherMovingObject.radius) > this.distance(otherMovingObject.pos)) {
      return true;
    }
    return false
  };
})();
