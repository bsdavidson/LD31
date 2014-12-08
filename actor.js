"use strict";

LD.Actor = function (game) {
  this.game = game;
  this.walkTimer = null;
};

var CAT_IDLE = [
  0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0
]

LD.Actor.prototype = {
  create: function () {
    this.cat = this.game.add.sprite(300, this.game.world.height - 32, 'cat');
    this.game.physics.arcade.enable(this.cat);

    this.cat.meow = this.game.add.audio('cat_meow');
    this.cat.hiss = this.game.add.audio('cat_hiss');
    this.cat.attack = this.game.add.audio('cat_attack');

    this.cat.body.collideWorldBounds = true;
    this.cat.body.bounce.y = 0.0;
    this.cat.body.bounce.x = 0.0;
    this.cat.body.gravity.y = 1200;
    this.cat.body.drag.x = 100;
    this.cat.body.drag.y = 100;
    this.cat.anchor.setTo(0.5, 1);
    this.cat.direction = -1;
    this.cat.pounceTimer = null;
    this.cat.animations.add('sit', CAT_IDLE, 6, true);
    this.cat.animations.add('swish', [0, 1, 2, 3, 2, 1, 0, 0], 10, true);
    this.cat.animations.add('walk', [5, 6, 7, 8, 9], 7, true);
    this.cat.animations.add('pounce', [10], 10, true);
    this.cat.animations.add('eat', [11, 12, 11, 12, 11, 12, 11, 12, 11, 12], 9, false);

    this.cat.animations.play('sit');
    this.game.physics.arcade.enable(this.cat);

  },

  update: function () {
    this.pointers();
    this.game.physics.arcade.collide(this.cat, this.platforms);
    this.game.physics.arcade.overlap(this.cat, this.player, function () {
      if (this.cat.body.touching.down && !this.player.hasCat) {
        if (this.cat.walkTimer) {
          this.cat.walkTimer = this.game.time.now;
          this.walk();
        } else {
          this.cat.meow.play();
          this.cat.walkTimer = this.game.time.now;
          this.walk();
        }
      }

    }, null, this);

    if (this.game.physics.arcade.distanceBetween(this.cat, this.bug) < 200 &&
      !this.player.controlDisabled && this.cat.body.touching.down) {
      this.pounce();
      this.cat.walkTimer = null;
    };

    this.game.physics.arcade.overlap(this.bug, this.cat, function () {
      if (this.bug.health < 30) {
        this.cat.walkTimer = null;
        this.bug.kill();

        this.cat.body.velocity.x = 0;
        this.cat.body.velocity.y = 0;

        this.game.state.start('GameWonCat');

      }
    }, null, this);

    if ((this.cat.walkTimer && this.cat.body.touching.down) || this.game.physics.arcade.distanceBetween(this.cat, this.player) > 80 ) {
      this.walk();
    }

    if (this.cat.body.touching.down) {
      this.cat.rotation = 0;
    } else {
      this.cat.walkTimer = null;
      this.actor.cat.animations.play('pounce');
    }


  }
};

LD.Actor.prototype.pointers = function () {
  this.bug = this.bug || this.game.bug.bug;
  this.baseball = this.baseball || this.game.items.baseball;
  this.fan_top = this.fan_top || this.game.level.fan_top;
  this.platforms = this.platforms || this.game.level.platforms;
  this.player = this.player || this.game.player.player;
  this.actor = this.actor || this.game.actor;
};

LD.Actor.prototype.pounce = function () {
  if (this.cat.pounceTimer) {
    var elapsedTime = this.game.time.now - this.cat.pounceTimer;

    if (elapsedTime > 4000) {
      this.cat.pounceTimer = null;
    }
  } else {
    this.cat.pounceTimer = this.game.time.now;
    this.cat.animations.play('pounce');
    this.cat.hiss.play();
    this.game.physics.arcade.moveToXY(this.cat, 300, 0, this.cat.y - 300, 750);
  }
};

LD.Actor.prototype.walk = function () {
  var vel = this.cat.body.velocity.x;

  if (this.cat.walkTimer || this.game.physics.arcade.distanceBetween(this.cat, this.player) && this.cat.body.touching.down) {
    var elapsedTime = this.game.time.now - this.cat.walkTimer;


    if (elapsedTime > 2000) {

      this.cat.animations.play('sit');
      this.cat.body.velocity.x = 0;
      this.cat.walkTimer = null;
    } else {

      if (this.cat.x < 100) {
        this.cat.direction = 1;
        this.cat.scale.x = 1
        this.cat.scale.x = -1;

      } else if (this.cat.y > 650) {
        this.cat.direction = -1;
        this.cat.scale.x = 1
      } else {}
      this.cat.body.velocity.x = 50 * this.cat.direction;
      this.cat.animations.play('walk');

    }
  }
};
