(function () {
// if Asteroids === undefined = {}
  window.Asteroids = window.Asteroids || {};
  var Asteroid = window.Asteroids.Asteroid;

  var Game = window.Asteroids.Game = function (canvasEl) {
    this.DIM_X = canvasEl.height;
    this.DIM_Y = canvasEl.width;
    this.NUM_ASTEROIDS = 20;
    this.asteroids = [];
    this.addAsteroids();
    this.ship = this.createShip();
    this.bindEvent();
    this.bullets = [];
  };


  Game.prototype = {

    bindEvent: function() {
      var ship = this.ship;
      key('w', function() { ship.moveShip('w') });
      key('a', function() { ship.moveShip('a') });
      key('d', function() { ship.moveShip('d') });
      key('u', function() { this.bullet() }.bind(this));
    },

    bullet: function () {
      pos = this.ship.pos.slice(0)
      bullet = new window.Asteroids.Bullet(pos, this.ship.angle, this);
      console.log(bullet)
      this.bullets.push(bullet)
    },

    addAsteroids: function() {
      for (var i = 0; i < this.NUM_ASTEROIDS; i++) {

      this.asteroids.push(new window.Asteroids.Asteroid(this));
      }
    },

    start: function(canvasEl) {
      this.gameView.start(canvasEl);
    },

    wrap: function(pos) {
      if (pos[0] > this.DIM_X || pos[0] < 0){
        pos[0] = (pos[0] + this.DIM_X) % this.DIM_X;
      }
      if (pos[1] > this.DIM_Y || pos[1] < 1){
        pos[1] = (pos[1] + this.DIM_Y) % this.DIM_Y;
      }
    },

    render: function(ctx) {
      ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);
      this.ship.draw(ctx);
      this.asteroids.forEach(function(asteroid) {
        asteroid.draw(ctx);
      });
      this.bullets.forEach(function(bullet) {
        bullet.draw(ctx);
      });
    },

    moveAsteroids: function() {
      this.checkCollisions();
      this.ship.move();
      this.bullets.forEach(function (bullet) {
        bullet.move();
      });
      this.asteroids.forEach(function(movable) {
        movable.move();
      });
    },

    checkCollisions: function() {
      for (var i = 0; i < this.asteroids.length - 1; i++) {
        var currentAsteroid = this.asteroids[i];
        for (var j = i + 1; j < this.asteroids.length; j++) {
          if (i !== j) {
            currentAsteroid.isCollidedWith(this.asteroids[j]);
          }
        }
      }
    },

    createShip: function () {
      return new window.Asteroids.Ship(this);
    }
   };
})();
