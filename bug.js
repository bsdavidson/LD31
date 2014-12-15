(function() {
  'use strict';

  LD.Bug = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 150, 45, 'bug_ani');

    this.gameState = gameState;

    this.flySound = this.game.add.audio('fly_sound');

    this.angry = false;
    this.angerTimer = null;
    this.flying = false;
    this.healthText = this.game.make.text(1, 1, 'Bug : ' + this.health, {
      font: '20px Arial',
      fill: '#ff0044',
      align: 'center'
    });

    this.animations.add('walk', [0, 1], 10, true);
    this.animations.add('fly', [2, 3], 20, true);
    this.animations.add('stop', [0], 10, true);
    this.animations.add('die', [4, 5, 6, 7], 10, false);
    this.animations.play('walk');
    this.game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 0.5);
    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0;
    this.body.bounce.x = 0.4;
    this.body.gravity.y = -400;
    this.health = 100;
  };

  LD.Bug.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Bug.prototype.constructor = LD.Bug;

  LD.Bug.prototype.update = function() {
    this.healthText.text = 'Bug : ' + this.health;

    // if (this.health < 50 && !this.flying) {
    //   this.angry = true;
    //   console.log('FLY now!!');
    //   this.game.bug.animations.play('fly');
    //   this.flying = true;
    //   this.body.gravity.y = -600;
    //   this.body.gravity.x = 0;
    //   this.game.physics.arcade.moveToXY(this, 500,
    //     this.game.player.x + 400, this.game.player.y + 100, 750);
    // }

    if (this.health <= 0) {
      this.animations.play('die');
      this.body.gravity.y = 20;
      this.isAlive = false;
      this.game.physics.arcade.moveToXY(this, 800, 300, 30, 750);
      this.events.onAnimationComplete.add(function() {
        this.kill();
        this.game.state.start('GameWon');
      }, this);
    }

    if (this.body.touching.up && !this.angry) {
      // console.log('Im Calm');
      this.flying = false;
      this.body.velocity.y = 0;
      this.body.velocity.x = 0;
      this.animations.play('stop');
    }

    if (this.angerTimer) {
      // console.log('ANGRY!');
      var elapsedTime = this.game.time.now - this.angerTimer;
      if (elapsedTime > 2000) {
        // console.log('No ANGRY!');
        this.angry = false;
        this.angerTimer = null;
      }
    }

    // The Bug hit the fan.
    var fanTop = this.gameState.level.fanTop;
    this.game.physics.arcade.overlap(this, fanTop, function() {
      this.health -= 10;
      this.game.physics.arcade.moveToXY(this, 500, this.x + 400, this.y + 100,
        750);
    }, null, this);

    // We hit the bug with the ball.
    this.game.physics.arcade.collide(this, this.gameState.baseball, function() {
      this.gameState.baseball.hitSound.play();
      this.health -= 10;
    }, null, this);

    // What happens when we get close enough to scare him
    var baseball = this.gameState.baseball;
    var distance = this.game.physics.arcade.distanceBetween(this, baseball);
    if (distance < 90 && !this.flying) {
      this.flySound.play();
      this.angry = true;
      this.angerTimer = this.game.time.now;
      this.animations.play('fly');
      this.flying = true;
      this.body.gravity.y = -600;
      this.body.gravity.x = 0;
      this.game.physics.arcade.moveToXY(this, 500, this.x * 2, this.y * 2, 750);
    }
  };
}());
