"use strict";
var Player = function(game, x, y){
    this.game = game;
    this.player = null;
    this.arm = null;
    this.startX = 100;
    this.startY = 100;

};

var nextFire = 0;

Player.prototype = {
    preload: function() {
      // this.game.load.image('brian', 'assets/little_brian.png');
      this.game.load.spritesheet('brian_ani', 'assets/little_brian_ani.png', 33, 60);
      //this.game.load.image('arm', 'assets/brian_arm.png');
      this.game.load.image('baseball', 'assets/baseball.png');
      this.game.load.image('watergun', 'assets/water_gun.png');


      this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    create: function() {
      // Create our child
      this.player = this.game.add.sprite(90, 400, 'brian_ani');
      this.baseball = this.game.add.sprite(290, 400, 'baseball');

      this.player.hasBaseball = false;
      this.player.hasWatergun = false;

      this.game.physics.arcade.enable(this.player);
      this.game.physics.arcade.enable(this.baseball);
      //this.player.anchor.setTo(0.5, 0.5);
       this.player.anchor.setTo(0.5, 1);

      this.baseball.body.collideWorldBounds = true;
      this.baseball.body.bounce.y = 0.2;
      this.baseball.body.bounce.x = 0.5;
      this.baseball.body.gravity.y = 800;

      this.player.body.collideWorldBounds = true;
      this.player.body.bounce.y = 0.0;
      this.player.body.gravity.y = 800;

      this.player.animations.add('walk', [1, 2, 3, 4, 5, 6], 10, true);

      //Throw stuff
       //  Our bullet group
      //this.toys = this.game.add.group();
      // this.toys.enableBody = true;
      // this.toys.physicsBodyType = Phaser.Physics.ARCADE;
      // this.toys.createMultiple(10, 'baseball', 0, false);
      // this.toys.setAll('anchor.x', 0.5);
      // this.toys.setAll('anchor.y', 0.5);
      // this.toys.setAll('checkWorldBounds', true);
      // this.toys.setAll('body.allowGravity', true);
      // this.toys.setAll('body.collideWorldBounds', true);
      // this.toys.setAll('body.bounce.y', .5);
      // this.toys.setAll('body.gravity.y', 700);

    },

    update: function(level) {
      //console.log(level);

      // this.game.physics.arcade.overlap(this.player, level.watergun, function(){  },null,this);
      //this.game.physics.arcade.collide(this.player, level.layer[2]);
      this.game.physics.arcade.collide(this.player, this.baseball, function(){
        this.collectToy(this.player, level, this.baseball);
      }, null, this);
      // this.game.physics.arcade.collide(this.baseball, level.bug);
      //this.game.physics.arcade.collide(this.baseball, level.layer[2]);
      //this.game.physics.arcade.collide(level.bug, level.layer[2]);

      ///console.log(this.game.physics.arcade.distanceBetween(this.baseball, level.bug));

      if (this.game.physics.arcade.distanceBetween(this.baseball, level.bug) < 90 && !level.bug.flying) {
        console.log('FLY!');

        level.bug.animations.play('fly');
        level.bug.flying = true;
        level.bug.body.gravity.y = -600;
        level.bug.body.gravity.x = 0;
        this.game.physics.arcade.moveToXY(level.bug, 500, this.player.x + 400, this.player.y + 100, 750);
      };

       //console.log('player',this.player, this.player, 'bug', level.bug, level.bug);
      if (this.cursors.left.isDown) {
       // console.log('LEFT!');
        this.player.body.velocity.x = -150;
        this.player.animations.play('walk');

        this.player.scale.x = 1;
        this.player.scale.x = -1;

      } else if (this.cursors.right.isDown) {
        this.player.body.velocity.x = 150;
        this.player.animations.play('walk');
        this.player.scale.x = 1;

      } else {
        this.player.body.velocity.x = 0;
        this.player.animations.stop();
        this.player.frame = 0;

      }

      if (this.cursors.up.isDown) {
        console.log('Haz ball?', this.player.hasBaseball);
        this.fire(this.player, this.baseball);
      }

    }
};


Player.prototype.collectToy = function(player, level, toy) {
  toy.kill();
  player.hasBaseball = true;
  level.bug.flying = false;

};

Player.prototype.fire = function(player, item) {
   console.log('FIRE', player.hasBaseball);
      if (player.hasBaseball)
    {
        player.hasBaseball = false;
        console.log('fire', item)
        item.reset(player.x + 10, player.y - 100);
        item.rotation = this.game.physics.arcade.moveToPointer(item, 1000, this.game.input.activePointer, 500);
      }
};
