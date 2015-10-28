(function () {
  window.Asteroids = window.Asteroids || {};
  var Utils = window.Asteroids.Utils;

  var Asteroid = window.Asteroids.Asteroid = function (game) {
    Asteroids.MovingObject.call(this, {game: game});

    this.color = "blue";
    this.radius = 30;
    this.pos = [Utils.getRandomInt(0,800), Utils.getRandomInt(0,600)];
    this.vel = [Utils.getRandomInt(-17,17)/6, Utils.getRandomInt(-17,17)/6];
  };

  Utils.inherits(Asteroid, window.Asteroids.MovingObject);
})();
