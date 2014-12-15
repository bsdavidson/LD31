(function() {
  'use strict';

  LD.Player = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 90,
      gameState.game.world.height - 32, 'brian_ani');
    this.gameState = gameState;

    this.startX = 100;
    this.startY = 100;
    this.itemHolding = null;

    this.scream = this.game.add.audio('scream');
    this.game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1);

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0.0;
    this.body.gravity.y = 800;

    this.animations.add('walk', [0, 1, 2, 3, 4, 6], 10, true);
    this.animations.add('throw', [12, 13, 14], 6, false);
    this.animations.add('pickup', [10, 11], 4, false);
    this.animations.add('eww',
      [7, 8, 9, 8, 7, 8, 9, 8, 7, 8, 9, 8, 7, 8, 9, 8, 7], 10, false);

    this.game.cursors = this.game.input.keyboard.createCursorKeys();
    this.game.controls = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
      fire: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
      pickup: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
      drop: this.game.input.keyboard.addKey(Phaser.Keyboard.R),
      altPickup: this.game.input.keyboard.addKey(Phaser.Keyboard.T)
    };
  };

  LD.Player.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Player.prototype.constructor = LD.Player;

  LD.Player.prototype.update = function() {
    this.bug = this.gameState.bug;
    this.baseball = this.gameState.baseball;
    this.fanTop = this.gameState.level.fanTop;
    this.platforms = this.gameState.level.platforms;
    this.cat = this.gameState.cat;

    this.game.physics.arcade.collide(this, this.gameState.level.platforms);

    if (this.game.controls.pickup.isDown &&
        this.game.controls.pickup.repeats === 1) {
      var items = [this.baseball, this.cat];
      this.game.physics.arcade.overlap(this, items, function(player, item) {
        this.collectItem(item);
      }, null, this);
    }

    if (!this.game.controls.down.isDown) {
      this.game.physics.arcade.overlap(this, this.bug, function() {
        this.animations.play('eww');
        this.scream.play();
        this.controlDisabled = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.events.onAnimationComplete.add(function() {
          this.game.state.start('Gameover');
        }, this);
      }, null, this);
    }

    if (!this.controlDisabled) {
      if (this.game.controls.left.isDown) {
        // console.log('LEFT!');
        this.body.velocity.x = -150;
        this.animations.play('walk');
        this.scale.x = 1;
        this.scale.x = -1;
      } else if (this.game.controls.right.isDown) {
        this.body.velocity.x = 150;
        this.animations.play('walk');
        this.scale.x = 1;
      } else if (this.game.controls.down.isDown) {
        // console.log('duck!');
        this.animations.stop();
        this.frame = 15;
      } else {
        this.body.velocity.x = 0;
        this.animations.stop();
        this.frame = 0;
      }

      if (this.game.controls.up.isDown && this.body.touching.down) {
        // console.log('LEFT!');
        this.body.velocity.y = -350;
        this.animations.play('walk');
        this.frame = 0;
      }

      if (this.game.input.activePointer.isDown) {
        this.fire();
      }

      if (this.game.controls.drop.isDown &&
          this.game.controls.adrop.repeats === 1) {
        if (this.itemHolding) {
          this.itemHolding.reset(this.x + 100, this.y - 80);
          this.itemHolding = null;
        }
      }
    }
  };

  LD.Player.prototype.collectItem = function(item) {
    if (this.itemHolding) {
      this.itemHolding.reset(this.x + 50 , this.y - 80);
      this.itemHolding = null;
    }
    this.itemHolding = item;
    this.itemHolding.kill();
    this.itemHolding.flying = true;
  };

  LD.Player.prototype.fire = function() {
    // console.log(this.itemHolding);
    if (this.itemHolding) {
      this.itemHolding.reset(this.x, this.y - 80);
      this.animations.play('throw');
      this.itemHolding.rotation = this.game.physics.arcade.moveToPointer(
        this.itemHolding, this.itemHolding.acceleration,
        this.game.input.activePointer, 500);
      if (this.itemHolding.throwSound) {
        this.itemHolding.throwSound.play();
      }
      this.itemHolding = null;
    }
  };
}());
