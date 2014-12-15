(function() {
  'use strict';

  LD.Player = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 90,
      gameState.game.world.height - 32, 'brian_ani');
    this.gameState = gameState;

    this.startX = 100;
    this.startY = 100;
    this.itemHolding = null;
    this.throwFactor = 0;
    this.throwPower = 0;
    this.lastIncrement = 0;

    this.scream = this.game.add.audio('scream');
    this.game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1);

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0.0;
    this.body.gravity.y = 800;

   // this.powerBar = this.game.add.sprite(this.game.input.activePointer.x,
     // this.game.input.activePointer.y, 'health');

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
    this.game.physics.arcade.collide(this, this.gameState.level.platforms);

    //this.gameState.level.powerBar.x = this.game.input.activePointer.x;
    //this.gameState.level.powerBar.y = this.game.input.activePointer.y;
    this.gameState.level.powerBar.scale.x = 100 * (this.throwFactor / 100);

    if (!this.game.controls.down.isDown) {
      this.game.physics.arcade.overlap(this, this.gameState.bug, function() {
        this.animations.play('eww');
        this.scream.play();
        this.controlDisabled = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.events.onAnimationComplete.add(function() {
          this.game.state.start('GameOver');
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

      if (this.game.input.activePointer.isDown && this.itemHolding) {
        if (this.throwFactor < 100 && this.lastIncrement >= 0) {
          if (this.throwFactor < 90) {
            this.throwFactor += 2;
            this.lastIncrement = 2;
          } else {
            this.throwFactor += 0.5;
            this.lastIncrement = 0.5;
          }
        } else if (this.throwFactor > 0) {
          this.throwFactor -= 2;
          this.lastIncrement = -2;
        } else {
          this.throwFactor += 2;
          this.lastIncrement = 2;
        }
        this.throwPower = 1000 * (this.throwFactor / 100);
      }

      if (this.game.input.activePointer.isUp && this.itemHolding &&
          this.throwFactor > 0) {
        this.fire(this.throwPower);
        this.throwFactor = 0;
        this.throwPower = 0;
        this.lastIncrement = 0;
      }

      if (this.game.controls.pickup.isDown &&
          this.game.controls.pickup.repeats === 1) {
        var holdable = this.gameState.holdable;
        this.game.physics.arcade.overlap(this, holdable, function(_, item) {
          this.collectItem(item);
        }, null, this);
      }
      if (this.game.controls.drop.isDown &&
          this.game.controls.drop.repeats === 1 &&
          this.itemHolding) {
        this.itemHolding.reset(this.x + 100, this.y - 80);
        this.itemHolding = null;
      }
    }
  };

  LD.Player.prototype.collectItem = function(item) {
    if (this.itemHolding) {
      this.itemHolding.reset(this.x + 80 , this.y - 30);
      this.itemHolding = null;
    }
    this.itemHolding = item;
    if (this.gameState.throwable.indexOf(this.itemHolding) !== -1) {
      this.itemHolding.kill();
    }
    this.itemHolding.flying = true;
  };

  LD.Player.prototype.fire = function(power) {
    var item = this.itemHolding;
    if (!item) {
      return;
    }
    if (this.gameState.throwable.indexOf(item) !== -1) {
      item.reset(this.x, this.y - 50);
      if (item.body) {
        item.body.touching.left = false;
        item.body.touching.right = false;
        item.body.touching.up = false;
        item.body.touching.down = false;
      }
      this.animations.play('throw');
      item.flying = true;
      item.rotation = this.game.physics.arcade.moveToPointer(
        item, power, this.game.input.activePointer);
      if (item.throwSound) {
        item.throwSound.play();
      }
      this.itemHolding = null;
    }
  };
}());
