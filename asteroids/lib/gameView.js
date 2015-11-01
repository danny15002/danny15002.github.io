(function () {
// if Asteroids === undefined = {}
  window.Asteroids = window.Asteroids || {};
  var GameView = window.Asteroids.GameView = function (canvasEl) {
    this.game = new window.Asteroids.Game(canvasEl);

  };

  GameView.prototype.start = function (canvasEl) {
     // get a 2d canvas drawing context. The canvas API lets us call
     // a `getContext` method on a canvas DOM element.
    var ctx = canvasEl.getContext("2d");
    this.game.render(ctx);
    alert("Welcome to Asteroids.\n" +
    "Controls: w - thrust, j - shoot,\n" +
    "d - turn clockwise, a - turn counter-clockwise");
    this.interval = window.setInterval((function () {

      this.game.moveAsteroids();
      this.game.render(ctx);

    }).bind(this), 20);
    this.game.setInt(this.interval);
  };

})();
