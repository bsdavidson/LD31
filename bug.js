"use strict";

LD.Bug = function(game){
  this.game = game;
  this.bugTimer = null;
};

LD.Bug.prototype = {
    create: function () {

      this.bug = this.game.add.sprite(150, 45, 'bug_ani');
      this.bug.flying = false;
      this.bug.angerTimer = null;
      this.bug.angry = false;
      this.bug.animations.add('walk', [0, 1], 10, true);
      this.bug.animations.add('fly', [2, 3], 20, true);
      this.bug.animations.add('stop', [0], 10, true);
      this.bug.animations.add('die', [4, 5, 6, 7], 10, false);
      this.bug.animations.play('walk');
      //this.bug.debug = true;
      this.game.physics.arcade.enable(this.bug);
      this.bug.anchor.setTo(0.5, 0.5);
      this.bug.body.collideWorldBounds = true;
      this.bug.body.bounce.y = 0;
      this.bug.body.bounce.x = 0.4;
      this.bug.body.gravity.y = -400;
      this.bug.health = 100;
      console.log('health', this.bug.health);

    },

    update: function() {

      if (this.bug.health < 50 && !this.bug.flying) {
        this.bug.angry = true;
        console.log('FLY now!!');
        this.game.bug.bug.animations.play('fly');
        this.bug.flying = true;
        this.bug.body.gravity.y = -600;
        this.bug.body.gravity.x = 0;
        this.game.physics.arcade.moveToXY(this.bug, 500, this.game.player.x + 400, this.game.player.y + 100, 750);

      }

      if (this.bug.body.touching.up && !this.bug.angry) {
        // console.log('Im Calm');
        this.bug.flying = false;
        this.bug.body.velocity.y = 0;
        this.bug.body.velocity.x = 1;
        this.bug.animations.play('stop');
      }

    }
};

