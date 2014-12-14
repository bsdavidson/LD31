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

    this.game.physics.arcade.collide(this, this.platforms);
    this.game.physics.arcade.collide(this.bug, this.platforms);

    this.game.physics.arcade.overlap(this, this.baseball, function() {
      if (this.game.controls.pickup.isDown &&
          this.game.controls.pickup.repeats === 1) {
        this.collectItem(this.baseball);
      }
    }, null, this);

    this.game.physics.arcade.overlap(this, this.cat, function() {
      if (this.game.controls.pickup.isDown &&
          this.game.controls.pickup.repeats === 1) {
        this.collectItem(this.cat);
      }
    }, null, this);

    // Baseball hit the fan.
    this.game.physics.arcade.overlap(this.baseball, this.fanTop, function() {
      this.baseball.hitSound.play();
      this.game.physics.arcade.moveToXY(this.baseball, 500,
        this.x + 400, this.y + 100, 750);
    }, null, this);

    // The Bug hit the fan.
    this.game.physics.arcade.overlap(this.bug, this.fanTop, function() {
      this.bug.health -= 10;
      this.game.physics.arcade.moveToXY(this.bug, 500, this.x + 400,
        this.y + 100, 750);
    }, null, this);

    // We hit the bug with the ball.
    this.game.physics.arcade.collide(this.baseball, this.bug, function() {
      this.baseball.hitSound.play();
      this.bug.health -= 10;
    }, null, this);

    //We hit the cat with the baseball.
    this.game.physics.arcade.collide(this.baseball, this.cat, function() {
      if (Math.abs(this.baseball.body.velocity.x) > 50) {
        this.baseball.hitSound.play();
        this.cat.hiss.play();
      }
    }, null, this);

    this.game.physics.arcade.overlap(this.bug, this, function() {
      if (!this.game.controls.down.isDown) {
        this.animations.play('eww');
        this.scream.play();
        this.controlDisabled = true;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.events.onAnimationComplete.add(function() {
          this.game.state.start('Gameover');
        }, this);
      }
    }, null, this);

    // OH SNAP!

    // What happens when we get close enough to scare him
    var baseballDistance = this.game.physics.arcade.distanceBetween(
      this.baseball, this.bug);
    if (baseballDistance < 90 && !this.bug.flying) {
      this.bug.flySound.play();
      this.bug.angry = true;
      this.bug.angerTimer = this.game.time.now;
      this.bug.animations.play('fly');
      this.bug.flying = true;
      this.bug.body.gravity.y = -600;
      this.bug.body.gravity.x = 0;
      this.game.physics.arcade.moveToXY(
        this.bug, 500, this.x * 2, this.y * 2, 750);
    }

    if (this.baseball.body.velocity.x > 2) {
      this.baseball.rotation += 0.1;
    } else if (this.baseball.body.velocity.x < -2) {
      this.baseball.rotation += -0.1;
    } else {
      this.baseball.rotation = 0;
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
    // console.log('item', item);
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
