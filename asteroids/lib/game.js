(function () {
// if Asteroids === undefined = {}
  window.Asteroids = window.Asteroids || {};
  var Asteroid = window.Asteroids.Asteroid;

  var Game = window.Asteroids.Game = function (canvasEl) {
    this.DIM_X = canvasEl.height;
    this.DIM_Y = canvasEl.width;
    this.NUM_ASTEROIDS = 10;
    this.asteroids = [];
    this.asteroids.push(new window.Asteroids.Asteroid(this)) // TODO: remove
    this.addAsteroids();
    this.ship = this.createShip();
    this.bindEvent();
    this.bullets = [];
    this.canShoot = true;
    this.shootSound = new Audio('sounds/laserSound.mov');

  };


  Game.prototype = {

    setInt: function (interval) {
      this.interval = interval;
      this.ship.setInt(interval)
    },

    bindEvent: function() {
      var ship = this.ship;
      key('w', function() { ship.moveShip('w') });
      key('a', function() { ship.moveShip('a') });
      key('d', function() { ship.moveShip('d') });
      key('j', function() { this.bullet() }.bind(this));
      // key('k', function() { ship.collideCalc(this.asteroids[0])}.bind(this));
    },

    bullet: function () {
      pos = this.ship.pos.slice(0)

      if (this.canShoot) {
        bullet = new window.Asteroids.Bullet(pos, this.ship.angle, this);
        if (this.bullets.length < 10) {
          this.bullets.push(bullet)
        } else {
          this.bullets.shift()
          this.bullets.push(bullet)
        }
        this.shootSound.play();
        this.canShoot = false;
        window.setTimeout(function () {
          this.canShoot = true;
        }.bind(this), 750)
      }
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

      if (this.asteroids.length < 1) {
        window.clearInterval(this.interval);

        window.alert("you win!");
        new Asteroids.GameView(canvasEl).start(canvasEl);
        return;
      }

      for (var i = this.bullets.length - 1; i >= 0; i--) {
        bullet = this.bullets[i];
          console.log(bullet)
        if (bullet.pos[0] < 0 || bullet.pos[0] > 600 || bullet.pos[1] < 0 || bullet.pos[1] > 600) {
          this.bullets.splice(i,1)
        }
      }



      for (var i = 0; i < this.asteroids.length; i++) {
        var currentAsteroid = this.asteroids[i];
        this.ship.collideCalc(currentAsteroid);
      }

      var removeAsteroids = [];
      var removeBullets = [];

      for (var i = 0; i < this.asteroids.length; i++) {
        var currentAsteroid = this.asteroids[i];
        for (var j = 0; j < this.bullets.length; j++) {
          if (currentAsteroid.isDestroyed(this.bullets[j])) {
            removeAsteroids.push(i)
            removeBullets.push(j)
          }
        }
      }
      for (var i = removeAsteroids.length - 1; i >= 0; i--) {
        this.asteroids.splice(removeAsteroids[i],1)
      }
      for (var i = removeBullets.length - 1; i >= 0; i--) {
        this.bullets.splice(removeBullets[i],1)
      }

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
