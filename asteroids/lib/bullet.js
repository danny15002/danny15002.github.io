(function () {
// if Asteroids === undefined = {}
  window.Asteroids = window.Asteroids || {};
  var Utils = window.Asteroids.Utils;

  var Bullet = window.Asteroids.Bullet = function (pos, angle, game) {
    this.pos = pos;
    this.angle = angle;
    this.vel = 1;
    this.game = game;
  };
  Utils.inherits(Bullet, window.Asteroids.MovingObject);

  Bullet.prototype.move = function () {

    var vel = [-this.vel*Math.sin(this.angle), this.vel*Math.cos(this.angle)];
    console.log('mvoing bullet')
    this.pos[0] += vel[0];
    this.pos[1] += vel[1];
    this.game.wrap(this.pos);

  };

  Bullet.prototype.draw = function (ctx) {
    ctx.beginPath();
    var colors = ["red", "brown", "green", "blue", "yellow", "black", "white"];
    ctx.arc(this.pos[0], this.pos[1], 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'blue';//colors[Asteroids.Utils.getRandomInt(0,6)];
    ctx.fill();
  }

})();
