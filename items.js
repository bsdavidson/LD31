(function() {
  'use strict';

  LD.Items = function(game) {
    this.game = game;
  };

  LD.Items.prototype = {
    create: function() {
      this.bug = this.game.bug.bug;
      this.player = this.game.player.player;

      this.baseball = this.game.add.sprite(190, this.game.world.height - 36,
        'baseball');
      this.baseball.hitSound = this.game.add.audio('ball_hit');
      this.baseball.lastLocation = 'ground';

      this.game.physics.arcade.enable(this.baseball);
      this.baseball.body.collideWorldBounds = true;
      this.baseball.body.bounce.y = 0.2;
      this.baseball.body.bounce.x = 0.5;
      this.baseball.body.gravity.y = 800;
      this.baseball.body.drag.x = 100;
      this.baseball.body.drag.y = 100;
      this.baseball.anchor.setTo(0.5, 0.5);
    },

    update: function() {
      this.pointers();

      var onBaseballHitPlatform = function() {
        if (this.baseball.lastLocation !== 'ground') {
          this.baseball.hitSound.play();
          this.baseball.lastLocation = 'ground';
        }
      };
      this.game.physics.arcade.collide(this.baseball, this.platforms, null,
        onBaseballHitPlatform, this);

      // console.log(this.baseball.y, this.game.world.height);
      if (this.baseball.y < 439) {
        //console.log('In the Air');
        this.baseball.lastLocation = 'air';
      }
    }
  };

  LD.Items.prototype.pointers = function() {
    this.bug = this.bug || this.game.bug.bug;
    this.baseball = this.baseball || this.game.items.baseball;
    this.fanTop = this.fanTop || this.game.level.fanTop;
    this.platforms = this.platforms || this.game.level.platforms;
    this.player = this.player || this.game.player.player;
    this.actor = this.actor || this.game.actor;
  };
}());
