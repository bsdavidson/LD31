(function() {
  'use strict';

  var LOCATION_AIR = 'air';
  var LOCATION_GROUND = 'ground';

  LD.Baseball = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 190,
      gameState.game.world.height - 36, 'baseball');

    this.gameState = gameState;
    this.hitSound = this.game.add.audio('ball_hit');
    this.lastLocation = LOCATION_GROUND;

    this.game.physics.arcade.enable(this);
    this.acceleration = 1000;

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0.2;
    this.body.bounce.x = 0.5;
    this.body.gravity.y = 800;
    this.body.drag.x = 100;
    this.body.drag.y = 100;
    this.anchor.setTo(0.5, 0.5);
  };

  LD.Baseball.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Baseball.prototype.constructor = LD.Baseball;

  LD.Baseball.prototype.onHitPlatform = function() {
    if (this.lastLocation !== LOCATION_GROUND) {
      this.hitSound.play();
      this.lastLocation = LOCATION_GROUND;
    }
  };

  LD.Baseball.prototype.update = function() {
    var platforms = this.gameState.level.platforms;
    this.game.physics.arcade.collide(this, platforms, null,
      this.onHitPlatform, this);
    if (this.y < 439) {
      this.lastLocation = LOCATION_AIR;
    }
  };
}());
