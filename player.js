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
      this.game.load.spritesheet('brian_ani', 'assets/little_brian_ani.png', 55, 100);
      //this.game.load.image('arm', 'assets/brian_arm.png');
      this.game.load.image('baseball', 'assets/baseball.png');
      this.game.load.image('watergun', 'assets/water_gun.png');


      this.cursors = this.game.input.keyboard.createCursorKeys();
      this.controls = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        fire: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        pickup: this.game.input.keyboard.addKey(Phaser.Keyboard.E)
      };
    },

    create: function() {
      // Create our child
      this.player = this.game.add.sprite(90, this.game.world.height - 32, 'brian_ani');
      this.baseball = this.game.add.sprite(290, this.game.world.height - 36, 'baseball');

      this.player.hasBaseball = false;
      this.player.hasWatergun = false;

      this.game.physics.arcade.enable(this.player);
      this.game.physics.arcade.enable(this.baseball);
      //this.player.anchor.setTo(0.5, 0.5);
       this.player.anchor.setTo(0.5, 1);

      this.baseball.body.collideWorldBounds = true;
      this.baseball.body.bounce.y = 0.2;
      this.baseball.body.bounce.x = 0.5;
      this.baseball.body.gravity.y = 700;
      this.baseball.body.drag.x = 100;
      this.baseball.body.drag.y = 100;
      this.baseball.anchor.setTo(0.5, 0.5);
      //this.baseball.scale.x = 0.75;
      //this.baseball.scale.y = 0.75;


      this.player.body.collideWorldBounds = true;
      this.player.body.bounce.y = 0.0;
      this.player.body.gravity.y = 800;

      this.player.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);


    },

    update: function(level) {

      this.game.physics.arcade.collide(this.player, level.platforms);
      this.game.physics.arcade.collide(level.bug, level.platforms);
      this.game.physics.arcade.collide(this.baseball, level.platforms);

      this.game.physics.arcade.overlap(this.player, this.baseball, function(){
          if (this.controls.pickup.isDown) {
            this.collectToy(this.player, level, this.baseball);
          }
        }, null, this);

       this.game.physics.arcade.overlap(this.baseball, level.fan_top, function(){
          this.game.physics.arcade.moveToXY(this.baseball, 500, this.player.x + 400, this.player.y + 100, 750);
        }, null, this);

      this.game.physics.arcade.collide(this.baseball, level.bug);

      ///console.log(this.game.physics.arcade.distanceBetween(this.baseball, level.bug));

      if (level.bug.body.touching.up ) {
        level.bug.flying = false;
        level.bug.body.velocity.y = 0;
        level.bug.body.velocity.x = 1;
        level.bug.animations.play('stop');
      }


      if (this.game.physics.arcade.distanceBetween(this.baseball, level.bug) < 90 && !level.bug.flying) {
        console.log('FLY!');
        level.bug.animations.play('fly');
        level.bug.flying = true;
        level.bug.body.gravity.y = -600;
        level.bug.body.gravity.x = 0;
        this.game.physics.arcade.moveToXY(level.bug, 500, this.player.x + 400, this.player.y + 100, 750);
      };

      if (this.baseball.body.velocity.x > 2) {
        this.baseball.rotation += 0.1;
      } else if (this.baseball.body.velocity.x < -2){
        this.baseball.rotation += -0.1;
      } else {
        this.baseball.rotation = 0;
      }


       //console.log('player',this.player, this.player, 'bug', level.bug, level.bug);
      if (this.controls.left.isDown) {
       // console.log('LEFT!');
        this.player.body.velocity.x = -150;
        this.player.animations.play('walk');

        this.player.scale.x = 1;
        this.player.scale.x = -1;

      } else if (this.controls.right.isDown) {
        this.player.body.velocity.x = 150;
        this.player.animations.play('walk');
        this.player.scale.x = 1;

      } else {
        this.player.body.velocity.x = 0;
        this.player.animations.stop();
        this.player.frame = 0;

      }
      if (this.controls.up.isDown && this.player.body.touching.down) {
       // console.log('LEFT!');
        this.player.body.velocity.y = -350;
        this.player.animations.play('walk');
        this.player.frame = 0;

      }

      if (this.controls.fire.isDown) {
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
