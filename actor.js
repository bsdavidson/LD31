(function() {
  'use strict';

  var CAT_IDLE = [
    0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0
  ];
  var CAT_KILL_HEALTH = 30;
  var CAT_POUNCE_DISTANCE = 200;
  var CAT_POUNCE_TIME = 4000;
  var CAT_WALK_TIME = 2000;

  LD.Cat = function(gameState) {
    Phaser.Sprite.call(this, gameState.game, 300,
      gameState.game.world.height - 32, 'cat');

    this.gameState = gameState;

    this.game.physics.arcade.enable(this);

    this.meow = this.game.add.audio('cat_meow');
    this.hiss = this.game.add.audio('cat_hiss');
    this.attack = this.game.add.audio('cat_attack');

    this.body.collideWorldBounds = true;
    this.body.bounce.y = 0.0;
    this.body.bounce.x = 0.0;
    this.body.gravity.y = 700;
    this.body.drag.x = 100;
    this.body.drag.y = 100;
    this.body.setSize(35, 35, -7, -5);

    this.anchor.setTo(0.5, 1);
    this.direction = -1;
    this.flying = false;
    this.walkTimer = 0;
    this.acceleration = 1200;
    this.throwSound = this.attack;

    this.pounceTimer = 0;
    this.animations.add('sit', CAT_IDLE, 6, true);
    this.animations.add('swish', [0, 1, 2, 3, 2, 1, 0, 0], 10, true);
    this.animations.add('walk', [5, 6, 7, 8, 9], 7, true);
    this.animations.add('pounce', [10], 10, true);
    this.animations.add('eat',
      [11, 12, 11, 12, 11, 12, 11, 12, 11, 12], 9, false);

    this.sit();
  };

  LD.Cat.prototype = Object.create(Phaser.Sprite.prototype);
  LD.Cat.prototype.constructor = LD.Cat;

  LD.Cat.prototype.update = function() {
    var platforms = this.gameState.level.platforms;
    this.game.physics.arcade.collide(this, platforms);

    if (!this.gameState.player.controlDisabled) {
      this.checkBug();
    }

    this.checkBaseball();
    this.checkFan();
    this.checkPlayer();

    if (this.body.touching.down) {
      this.flying = false;
      this.rotation = 0;
      if (this.walkTimer > this.game.time.now) {
        this.walk();
      } else {
        this.sit();
      }
    } else {
      this.fly();
    }
  };

  LD.Cat.prototype.checkBaseball = function() {
    var baseball = this.gameState.baseball;

    this.game.physics.arcade.collide(this, baseball, function() {
      baseball.onHitCat(this);
      if (Math.abs(baseball.body.velocity.x) > 20 ||
          Math.abs(baseball.body.velocity.y) > 20) {
        this.hiss.play();
      }
    }, null, this);
  };

  LD.Cat.prototype.checkFan = function() {
    var fanTop = this.gameState.level.fanTop;
    this.game.physics.arcade.collide(this, fanTop, function() {
      this.gameState.baseball.hitSound.play();
      this.game.physics.arcade.moveToXY(this, this.x, this.y , 950);
    }, null, this);
  };

  LD.Cat.prototype.checkBug = function() {
    // Try to pounce on the bug if it's close enough.
    var bugDistance = this.game.physics.arcade.distanceBetween(
       this, this.gameState.bug);
    if (this.body.touching.down && bugDistance < CAT_POUNCE_DISTANCE) {
      this.walkTimer = 0;
      if (this.pounceTimer <= this.game.time.now) {
        this.pounceTimer = this.game.time.now + CAT_POUNCE_TIME;
        this.animations.play('pounce');
        this.hiss.play();
        this.game.physics.arcade.moveToXY(this, 300, 0, this.y - 300, 750);
      }
    }

    // If touching the bug and the bug is hurt enough, kill the bug.
    this.game.physics.arcade.overlap(this.gameState.bug, this, function() {
      if (this.gameState.bug.health <= CAT_KILL_HEALTH) {
        this.walkTimer = 0;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.gameState.bug.kill();
        this.game.state.start('GameWonCat');
      }
    }, null, this);
  };

  LD.Cat.prototype.checkPlayer = function() {
    // Make the cat walk away if the player gets too close.
    if (this.body.touching.down && !this.flying) {
      var player = this.gameState.player;
      this.game.physics.arcade.overlap(this, player, function() {
        if (!this.walkTimer) {
          this.meow.play();
        }
        this.walkTimer = this.game.time.now + CAT_WALK_TIME;
      }, null, this);
    }
  };

  LD.Cat.prototype.fly = function() {
    this.flying = true;
    this.walkTimer = 0;
    this.animations.play('pounce');
  };

  LD.Cat.prototype.sit = function() {
    this.body.velocity.x = 0;
    this.flying = false;
    this.walkTimer = 0;
    this.animations.play('sit');
  };

  LD.Cat.prototype.walk = function() {
    if (this.x < 100) {
      this.direction = 1;
      this.scale.x = -1;
    } else if (this.y > 650) {
      this.direction = -1;
      this.scale.x = 1;
    }
    // this.body.setSize(43, 35, -7, -5);
    this.body.velocity.x = 50 * this.direction;
    this.animations.play('walk');
  };
}());
