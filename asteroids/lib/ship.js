(function () {
// if Asteroids === undefined = {}
  window.Asteroids = window.Asteroids || {};
  var Utils = window.Asteroids.Utils;


  var Ship = window.Asteroids.Ship = function (game) {
    Asteroids.MovingObject.call(this, {game: game, pos: [300, 300], vel: 0});

    this.color = "red";
    this.radius = 20;
    this.angularSpeed = 0;
    this.angle = 0;
    this.thrust = false;

  };
  Utils.inherits(Ship, window.Asteroids.MovingObject);

  Ship.prototype.move = function () {
    var changed = false;

    var vel = [-this.vel*Math.sin(this.angle), this.vel*Math.cos(this.angle)];

    this.angle += this.angularSpeed;
    if (this.angle > 2*Math.PI || this.angle < -2*Math.PI){
      this.angle = this.angle % (2 * Math.PI);
    }
    this.pos[0] += vel[0];
    this.pos[1] += vel[1];
    this.game.wrap(this.pos);
    if (this.vel > 0) {this.vel -= .01;}
    if (this.angularSpeed > 0) {
      changed = true;
      this.angularSpeed -= .005;
      if (this.angularSpeed < .01) {this.angularSpeed = 0;}
    } else if (this.angularSpeed < 0 && !changed) {
      this.angularSpeed += .005;
      if (this.angularSpeed > -.01) {this.angularSpeed = 0;}
    }
  };

  Ship.prototype.draw = function (ctx) {

    x = this.pos[0];
    y = this.pos[1];

    // centroid of triangle (0, 0) ( -2, -6) ( 2, -6)
    // where does (-1, -3) to ( 2, -6) intersect (1, -3) to (-2, -6)
    // y + 3 = -3/3 ( x + 1) and y + 3 = -3/-3 ( x - 1)
    // y + 3 = -x - 1 and y + 3 = x - 1
    // -x - 1 = x - 1 ===>  x = 0, y = 4

    startPoint = [ x + (0 - (48)*Math.sin(this.angle)),
                   y + (0 + (48)*Math.cos(this.angle))]
    movePoint2 = [ x + ((-18)*Math.cos(this.angle) - (-6)*Math.sin(this.angle)),
                   y + ((-18)*Math.sin(this.angle) + (-6)*Math.cos(this.angle))]
    movePoint3 = [ x + ((24)*Math.cos(this.angle) - (-24)*Math.sin(this.angle)),
                   y + ((24)*Math.sin(this.angle) + (-24)*Math.cos(this.angle))]
    drawPoint1 = [ x + ((-24)*Math.cos(this.angle) - (-24)*Math.sin(this.angle)),
                   y + ((-24)*Math.sin(this.angle) + (-24)*Math.cos(this.angle))]
    drawPoint2 = [ x + ((18)*Math.cos(this.angle) - (-6)*Math.sin(this.angle)),
                   y + ((18)*Math.sin(this.angle) + (-6)*Math.cos(this.angle))]

    ctx.beginPath();
    ctx.moveTo( startPoint[0], startPoint[1]); // position
    ctx.lineTo( drawPoint1[0], drawPoint1[1]); // draw point 1
    ctx.moveTo( movePoint2[0], movePoint2[1]); // move point 2
    ctx.lineTo( drawPoint2[0], drawPoint2[1]); // draw point 2
    ctx.moveTo( movePoint3[0], movePoint3[1]); // move point 3
    ctx.lineTo( startPoint[0], startPoint[1]); // position

    ctx.strokeStyle = this.color;
    ctx.stroke();


    thrustStart = [ x + ((-12)*Math.cos(this.angle) - (-18)*Math.sin(this.angle)),
                    y + ((-12)*Math.sin(this.angle) + (-18)*Math.cos(this.angle))]
    thrustMove  = [ x + ((0)*Math.cos(this.angle) - (-36)*Math.sin(this.angle)),
                    y + ((0)*Math.sin(this.angle) + (-36)*Math.cos(this.angle))]
    thrustEnd   = [ x + ((12)*Math.cos(this.angle) - (-18)*Math.sin(this.angle)),
                    y + ((12)*Math.sin(this.angle) + (-18)*Math.cos(this.angle))]

    ctx.beginPath();
    ctx.moveTo( thrustStart[0], thrustStart[1]); // position
    ctx.lineTo( thrustMove[0], thrustMove[1]); // draw point 1
    ctx.lineTo( thrustEnd[0], thrustEnd[1]); // draw point 2

    var color = "black"
    if (this.thrust && (this.vel > 0)) {
      color = "orange"
    }
    this.thrust = !this.thrust;

    ctx.strokeStyle = color
    ctx.stroke();

  };

  Ship.prototype.moveShip = function(dir) {
    // TODO: give instructions, turn with a, d. go forward with w
    // console.log("poop pants");
    switch(dir) {
      case 'w':
          this.vel += .5;
          break;
      case 'a':
          this.angularSpeed -= .06;
          if (this.vel < 0) {this.vel += .1;}
          break;
      case 'd':
          this.angularSpeed += .06;
          if (this.vel > 0) {this.vel -= .1;}
          break;
      }

      if (this.vel > 5) { this.vel = 5; }
      if (this.angularSpeed < -.15) {this.angularSpeed = -.15}
      if (this.angularSpeed > .15) {this.angularSpeed = .15}
  }

})();
