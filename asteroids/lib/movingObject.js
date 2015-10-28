(function () {
// if Asteroids === undefined = {}
  window.Asteroids = window.Asteroids || {};

  var MovingObject = window.Asteroids.MovingObject = function (hash) {
    this.pos = hash.pos;
    this.vel = hash.vel;
    this.radius = hash.radius;
    this.color = hash.color;
    this.game = hash.game;
    // this.colors = ["red", "brown", "green", "blue", "yellow", "black", "white"];
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.beginPath();
    var colors = ["red", "brown", "green", "blue", "yellow", "black", "white"];
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;;//colors[Asteroids.Utils.getRandomInt(0,6)];
    ctx.fill();
  };


  MovingObject.prototype.move = function () {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.game.wrap(this.pos);
  };


  MovingObject.prototype.distance = function (otherPos) {
    var dx = this.pos[0] - otherPos[0];
    var dy = this.pos[1] - otherPos[1];
    var d =   Math.sqrt( Math.pow( dx , 2) +
                         Math.pow( dy , 2));
    return d;
  };


  MovingObject.prototype.isCollidedWith = function (otherMovingObject) {
    if ((this.radius + otherMovingObject.radius + 2) > this.distance(otherMovingObject.pos)) {
      this.collideCalc(otherMovingObject);
    }
  };

  MovingObject.prototype.collideCalc = function(that) {
    var dcx = this.pos[0] - that.pos[0];
    var dcy = this.pos[1] - that.pos[1];
    var dcmag = this.pyth( dcx , dcy);
    var cn = [dcx/dcmag, dcy/dcmag];
    var ct = [-dcy/dcmag, dcx/dcmag];
    var v1n = cn[0] * this.vel[0] + cn[1] * this.vel[1];
    var v1t = ct[0] * this.vel[0] + ct[1] * this.vel[1];
    var v2n = cn[0] * that.vel[0] + cn[1] * that.vel[1];
    var v2t = ct[0] * that.vel[0] + ct[1] * that.vel[1];

    var v1nAfter = v2n;
    var v2nAfter = v1n;

    // var v1nAfterVector = [v1nAfter * cn[0], v1nAfter * cn[1]];
    // var v1tAfterVector = [v1t * ct[0], v1t * ct[1]];
    // var v2nAfterVector = [v2nAfter * cn[0], v2nAfter * cn[1]];
    // var v2tAfterVector = [v2t * ct[0], v2t * ct[1]];

    this.vel = [v1nAfter * cn[0] + v1t * ct[0], v1nAfter * cn[1] + v1t * ct[1]];
    that.vel = [v2nAfter * cn[0] + v2t * ct[0], v2nAfter * cn[1] + v2t * ct[1]];
    // this.move();
    // that.move();
  }

  MovingObject.prototype.pyth = function(a, b) {
    return Math.sqrt( Math.pow(a, 2) + Math.pow(b, 2));
  }

  // var mo = new MovingObject({pos: [200, 200], vel: [5,5], radius: 80, color: "green"});
  // mo.draw();

})();
