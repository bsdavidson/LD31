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

    // Baseball hit the light.
    var fanLight = this.gameState.level.fanLight;
    this.game.physics.arcade.collide(this, fanLight, function() {
      var velocity;
      if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
        velocity = Math.abs(this.body.velocity.x);
      } else {
        velocity = Math.abs(this.body.velocity.y);
      }
      if (fanLight.status === 'good') {
        if (velocity > 410) {
          fanLight.animations.play('break');
          fanLight.status = 'broken';
        } else {
          fanLight.animations.play('shake');
        }
      }
    }, null, this);

    if (Math.abs(this.body.velocity.x) > 2) {
      var sign = this.body.velocity.x < 0 ? -1 : 1;
      this.rotation += 0.1 * sign;
    } else {
      this.rotation = 0;
    }
  };

  var WATER_GUN_OFFSET_X = 16;
  var WATER_GUN_OFFSET_Y = -45;
  var WATER_OFFSET = 8;
  var WATER_OFFSET_ANGLE = -0.6;
  var WATER_SPEED = 500;
  var WATER_WIGGLE = 0.1;

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

    this.emitter = this.game.make.emitter();
    this.emitter.makeParticles('water');
    this.emitter.start(false, 1000, 50, 0, false);
    this.emitter.on = false;
    this.addChild(this.emitter);
  };

  LD.WaterGun.prototype = Object.create(Phaser.Sprite.prototype);
  LD.WaterGun.prototype.constructor = LD.WaterGun;

  LD.WaterGun.prototype.preUpdate = function() {
    return Phaser.Sprite.prototype.preUpdate.call(this);
  };

  LD.WaterGun.prototype.update = function() {
    this.emitter.on = false;
    var player = this.gameState.player;
    if (player && player.itemHolding === this) {
      this.updateHeld(player);
    } else {
      this.updateDropped(player);
    }

    // Position the emitter on the end of the gun
    var offsetAngle;
    if (this.flipped) {
      offsetAngle = this.emitterAngle - WATER_OFFSET_ANGLE;
    } else {
      offsetAngle = this.emitterAngle + WATER_OFFSET_ANGLE;
    }
    this.emitter.x = this.x + Math.cos(offsetAngle) * WATER_OFFSET;
    this.emitter.y = this.y + Math.sin(offsetAngle) * WATER_OFFSET;
  };

  LD.WaterGun.prototype.updateDropped = function(player) {
    this.frame = 0;
    this.flipped = false;
    this.body.enable = true;
    this.game.physics.arcade.collide(this, this.gameState.level.platforms);
  };

  LD.WaterGun.prototype.updateHeld = function(player) {
    this.body.enable = false;
    this.x = player.x + player.scale.x * WATER_GUN_OFFSET_X;
    this.y = player.y + WATER_GUN_OFFSET_Y;

    this.flipped = player.scale.x < 0;
    this.frame = this.flipped ? 1 : 0;

    var pointer = this.game.input.activePointer;
    var pointerAngle = this.game.physics.arcade.angleToPointer(this, pointer);
    this.emitterAngle = pointerAngle;
    this.rotation = pointerAngle;
    if (this.flipped) {
      this.rotation = Phaser.Math.reverseAngle(this.rotation);
    }

    if (pointer.isDown) {
      var minDirX = Math.cos(pointerAngle - WATER_WIGGLE);
      var minDirY = Math.sin(pointerAngle - WATER_WIGGLE);
      var maxDirX = Math.cos(pointerAngle + WATER_WIGGLE);
      var maxDirY = Math.sin(pointerAngle + WATER_WIGGLE);
      this.emitter.setXSpeed(minDirX * WATER_SPEED, maxDirX * WATER_SPEED);
      this.emitter.setYSpeed(minDirY * WATER_SPEED, maxDirY * WATER_SPEED);
      this.emitter.on = true;
    }
  };
}());
