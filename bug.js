(function() {
  'use strict';

  LD.Bug = function(game) {
    this.game = game;
  };

  LD.Bug.prototype = {
    create: function() {
      this.flySound = this.game.add.audio('fly_sound');

      this.bug = this.game.add.sprite(150, 45, 'bug_ani');
      this.bug.angry = false;
      this.bug.bugTimer = null;
      this.bug.angerTimer = null;
      this.bug.flying = false;
      this.bug.healthText = this.game.add.text(1,
        1, 'Bug : ' + this.bug.health,
        {
          font: '20px Arial',
          fill: '#ff0044',
          align: 'center'
        });

      this.bug.animations.add('walk', [0, 1], 10, true);
      this.bug.animations.add('fly', [2, 3], 20, true);
      this.bug.animations.add('stop', [0], 10, true);
      this.bug.animations.add('die', [4, 5, 6, 7], 10, false);
      this.bug.animations.play('walk');
      this.game.physics.arcade.enable(this.bug);
      this.bug.anchor.setTo(0.5, 0.5);
      this.bug.body.collideWorldBounds = true;
      this.bug.body.bounce.y = 0;
      this.bug.body.bounce.x = 0.4;
      this.bug.body.gravity.y = -400;
      this.bug.health = 100;
    },

    update: function() {
      this.pointers();

      this.bug.healthText.text = 'Bug : ' + this.bug.health;

      // if (this.bug.health < 50 && !this.bug.flying) {
      //   this.bug.angry = true;
      //   console.log('FLY now!!');
      //   this.game.bug.bug.animations.play('fly');
      //   this.bug.flying = true;
      //   this.bug.body.gravity.y = -600;
      //   this.bug.body.gravity.x = 0;
      //   this.game.physics.arcade.moveToXY(this.bug, 500,
      //     this.game.player.x + 400, this.game.player.y + 100, 750);
      // }

      if (this.bug.health <= 0) {
        this.bug.animations.play('die');
        this.bug.body.gravity.y = 20;
        this.bug.isAlive = false;
        this.game.physics.arcade.moveToXY(this.bug, 800, 300, 30, 750);
        this.bug.events.onAnimationComplete.add(function() {
          this.bug.kill();
          this.game.state.start('GameWon');
        }, this);
      }

      if (this.bug.body.touching.up && !this.bug.angry) {
        // console.log('Im Calm');
        this.bug.flying = false;
        this.bug.body.velocity.y = 0;
        this.bug.body.velocity.x = 1;
        this.bug.animations.play('stop');
      }

      if (this.bug.angerTimer) {
        // console.log('ANGRY!');
        var elapsedTime = this.game.time.now - this.bug.angerTimer;
        if (elapsedTime > 2000) {
          // console.log('No ANGRY!');
          this.bug.angry = false;
          this.bug.angerTimer = null;
        }
      }
    }
  };

  LD.Bug.prototype.pointers = function() {
    this.bug = this.bug || this.game.bug.bug;
    this.baseball = this.baseball || this.game.items.baseball;
    this.fanTop = this.fanTop || this.game.level.fanTop;
    this.platforms = this.platforms || this.game.level.platforms;
    this.player = this.player || this.game.player.player;
    this.actor = this.actor || this.game.actor;
  };
}());
