"use strict";
LD.Player = function(game){
    this.game = game;
    this.player = null;
    this.startX = 100;
    this.startY = 100;

};

LD.Player.prototype = {

    create: function() {
      // Create our child
      this.itemHolding = null;
      this.bug = this.game.bug.bug;
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
      this.player.animations.add('eww', [7, 8, 9, 8, 7, 8, 9, 8, 7, 8, 9, 8, 7, 8, 9, 8, 7], 10, false);

      this.game.cursors = this.game.input.keyboard.createCursorKeys();
      this.game.controls = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        fire: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        pickup: this.game.input.keyboard.addKey(Phaser.Keyboard.E)
      };
    },

    update: function(level) {

      this.game.physics.arcade.collide(this.player, this.game.level.platforms);
      this.game.physics.arcade.collide(this.bug, this.game.level.platforms);
      this.game.physics.arcade.collide(this.baseball, this.game.level.platforms);

      this.game.physics.arcade.overlap(this.player, this.baseball, function(){
      if (this.game.controls.pickup.isDown) {
            this.collectToy(this.baseball);
          }
          }, null, this);

       this.game.physics.arcade.overlap(this.game.level.cat, this.player, function(){
        console.log('Cat time');
        this.game.level.cat.animations.play('walk');
        this.game.level.cat.body.velocity.x = -50;
        this.game.level.cat.body.velocity.y = 0;
      },null,this);


        // Baseball hit the fan.
       this.game.physics.arcade.overlap(this.baseball, this.game.level.fan_top, function(){
          this.game.physics.arcade.moveToXY(this.baseball, 500, this.player.x + 400, this.player.y + 100, 750);
        }, null, this);


       // The Bug hit the fan.
       this.game.physics.arcade.overlap(this.bug, this.game.level.fan_top, function(){
          this.bug.health -= 10;
          if (this.bug.health <= 0){
            this.bug.animations.play('die');
            this.bug.body.gravity.y = 20;
            this.bug.isAlive = false;
            this.game.physics.arcade.moveToXY(this.bug, 500, 300, 30, 750);
            this.bug.events.onAnimationComplete.add(function(){
              this.bug.kill();
              this.game.state.start('Game');
            }, this);

          } else {
            this.game.physics.arcade.moveToXY(this.bug, 500, this.player.x + 400, this.player.y + 100, 750);
          }
        }, null, this);

      // We hit the bug with the ball.
      this.game.physics.arcade.collide(this.baseball, this.bug, function(){
        this.bug.health -= 10;
        console.log(this.bug.health);
      },null,this);

      this.game.physics.arcade.overlap(this.bug, this.player, function(){
        this.player.animations.play('eww');
        this.player.controlDisabled = true;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.events.onAnimationComplete.add(function(){
          this.game.state.start('Gameover');
        }, this);
      },null,this);

      // OH SNAP!
      if (this.bug.angry) {
         var elapsedTime = this.game.time.now - this.bug.angerTimerStart;
         if (elapsedTime > 2000 && this.bug.health < 50){
              this.bug.angerTimerStart = this.game.time.now;
              this.game.physics.arcade.moveToXY(this.bug, 500, this.player.x, this.player.y, 750);
          } else if (elapsedTime > 2000) {
            this.bug.angry = false;
          }
       }

      // What happens when we get close enough to scare him
      if (this.game.physics.arcade.distanceBetween(this.baseball, this.bug) < 90 && !this.bug.flying) {
        this.bug.angry = true;
        this.bug.angerTimerStart = this.game.time.now;
        this.bug.animations.play('fly');
        this.bug.flying = true;
        this.bug.body.gravity.y = -600;
        this.bug.body.gravity.x = 0;
        this.game.physics.arcade.moveToXY(this.bug, 500, this.player.x + 400, this.player.y + 100, 750);
      };

      if (this.baseball.body.velocity.x > 2) {
        this.baseball.rotation += 0.1;
      } else if (this.baseball.body.velocity.x < -2){
        this.baseball.rotation += -0.1;
      } else {
        this.baseball.rotation = 0;
      }


       // console.log('player',this.player, 'bug', this.bug);
      if (!this.player.controlDisabled){
        if (this.game.controls.left.isDown) {
         // console.log('LEFT!');
          this.player.body.velocity.x = -150;
          this.player.animations.play('walk');

          this.player.scale.x = 1;
          this.player.scale.x = -1;

        } else if (this.game.controls.right.isDown) {
          this.player.body.velocity.x = 150;
          this.player.animations.play('walk');
          this.player.scale.x = 1;

        } else {
          this.player.body.velocity.x = 0;
          this.player.animations.stop();
          this.player.frame = 0;

        }
        if (this.game.controls.up.isDown && this.player.body.touching.down) {
         // console.log('LEFT!');
          this.player.body.velocity.y = -350;
          this.player.animations.play('walk');
          this.player.frame = 0;

        }

        if (this.game.input.activePointer.isDown) {
          this.fire(this.baseball);
        }
      }

    }
};


LD.Player.prototype.collectToy = function(toy) {
  toy.kill();
  this.player.hasBaseball = true;
  this.bug.flying = false;

};


LD.Player.prototype.gameWin = function() {



};

LD.Player.prototype.fire = function(item) {
      if (this.player.hasBaseball)
    {
        this.player.hasBaseball = false;
        item.reset(this.player.x + 10, this.player.y - 100);
        item.rotation = this.game.physics.arcade.moveToPointer(item, 1000, this.game.input.activePointer, 500);
      }
};

