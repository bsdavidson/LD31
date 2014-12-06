Player = function(game, x, y){
    this.game = game;
    this.sprite = null;
    this.startX = 100;
    this.startY = 100;

};

Player.prototype = {

    preload: function () {

      this.game.load.image('brian', 'assets/little_brian.png');
      this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    create: function () {
      var player = this.sprite = this.game.add.sprite(32, game.world.height - 150, 'brian');
      this.game.physics.arcade.enable(this.sprite);
      player.body.collideWorldBounds = true;
      player.body.bounce.y = 0.2;
      player.body.gravity.y = 800;

    },

    update: function(level) {

    }

};
