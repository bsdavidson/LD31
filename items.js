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
    this.flying = false;

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

  LD.Baseball.prototype.onHitCat = function() {
    if (Math.abs(this.body.velocity.x) > 50) {
      this.hitSound.play();
    }
  };

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

    // Baseball hit the fan.
    var fanTop = this.gameState.level.fanTop;
    this.game.physics.arcade.overlap(this, fanTop, function() {
      this.hitSound.play();
      this.game.physics.arcade.moveToXY(this, 500,
        this.x + 400, this.y + 100, 750);
    }, null, this);

    if (Math.abs(this.body.velocity.x) > 2) {
      var sign = this.body.velocity.x < 0 ? -1 : 1;
      this.rotation += 0.1 * sign;
    } else {
      this.rotation = 0;
    }
  };

  LD.WaterGun = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 500,
      gameState.game.world.height - 50, 'water_gun');

    this.flying = false;
    this.gameState = gameState;

    this.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.bounce.x = 0.5;
    this.body.bounce.y = 0.2;
    this.body.gravity.y = 800;
    this.body.drag.x = 100;
    this.body.drag.y = 100;
  };

  LD.WaterGun.prototype = Object.create(Phaser.Sprite.prototype);
  LD.WaterGun.prototype.constructor = LD.WaterGun;

  LD.WaterGun.prototype.update = function() {
    var platforms = this.gameState.level.platforms;
    this.game.physics.arcade.collide(this, platforms);
  };
}());
