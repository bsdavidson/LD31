"use strict";
LD.Player = function (game) {
    this.game = game;
    this.player = null;
    this.startX = 100;
    this.startY = 100;
    this.itemHolding = null;
    this.hasBaseball = false;
    this.hasCat = false;

};

LD.Player.prototype = {
    create: function () {

        this.player = this.game.add.sprite(90, this.game.world.height - 32, 'brian_ani');
        this.player.scream = this.game.add.audio('scream');
        this.game.physics.arcade.enable(this.player);
        this.player.anchor.setTo(0.5, 1);

        this.player.body.collideWorldBounds = true;
        this.player.body.bounce.y = 0.0;
        this.player.body.gravity.y = 800;

        this.player.animations.add('walk', [0, 1, 2, 3, 4, 5], 10, true);
        this.player.animations.add('throw', [12, 13, 14],6, false);
        this.player.animations.add('pickup', [10, 11], 4, false);
        this.player.animations.add('eww', [7, 8, 9, 8, 7, 8, 9, 8, 7, 8, 9, 8, 7, 8, 9, 8, 7], 10, false);

        this.game.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.controls = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            fire: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
            pickup: this.game.input.keyboard.addKey(Phaser.Keyboard.E),
            drop: this.game.input.keyboard.addKey(Phaser.Keyboard.R)
        };
    },

    update: function () {
        this.pointers();

        this.game.physics.arcade.collide(this.player, this.platforms);
        this.game.physics.arcade.collide(this.bug, this.platforms);

        this.game.physics.arcade.overlap(this.player, this.baseball, function () {
            if (this.game.controls.pickup.isDown) {
                this.collectToy(this.baseball);
            }
        }, null, this);

        this.game.physics.arcade.overlap(this.player, this.actor.cat, function () {
            if (this.game.controls.pickup.isDown) {
                this.collectCat(this.actor.cat);
            }
        }, null, this);


        // Baseball hit the fan.
        this.game.physics.arcade.overlap(this.baseball, this.fan_top, function () {
            this.baseball.hitSound.play();
            this.game.physics.arcade.moveToXY(this.baseball, 500, this.player.x + 400, this.player.y + 100, 750);
        }, null, this);

        // The Bug hit the fan.
        this.game.physics.arcade.overlap(this.bug, this.fan_top, function () {
            this.bug.health -= 10;

                this.game.physics.arcade.moveToXY(this.bug, 500, this.player.x + 400, this.player.y + 100, 750);
        }, null, this);

        // We hit the bug with the ball.
        this.game.physics.arcade.collide(this.baseball, this.bug, function () {
            this.baseball.hitSound.play();
            this.bug.health -= 10;
        }, null, this);

        this.game.physics.arcade.overlap(this.bug, this.player, function () {
            if (!this.game.controls.down.isDown) {
                this.player.animations.play('eww');
                this.player.scream.play();
                this.player.controlDisabled = true;
                this.player.body.velocity.x = 0;
                this.player.body.velocity.y = 0;
                this.player.events.onAnimationComplete.add(function () {
                    this.game.state.start('Gameover');
                }, this);
            }
        }, null, this);

        // OH SNAP!


        // What happens when we get close enough to scare him
        if (this.game.physics.arcade.distanceBetween(this.baseball, this.bug) < 90 && !this.bug.flying) {
            this.game.bug.fly_sound.play();
            this.bug.angry = true;
            this.bug.angerTimer = this.game.time.now;
            this.bug.animations.play('fly');
            this.bug.flying = true;
            this.bug.body.gravity.y = -600;
            this.bug.body.gravity.x = 0;
            this.game.physics.arcade.moveToXY(this.bug, 500, this.player.x * 2, this.player.y * 2, 750);
        };

        if (this.baseball.body.velocity.x > 2) {
            this.baseball.rotation += 0.1;
        } else if (this.baseball.body.velocity.x < -2) {
            this.baseball.rotation += -0.1;
        } else {
            this.baseball.rotation = 0;
        }

        if (!this.player.controlDisabled) {
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

            } else if (this.game.controls.down.isDown) {
                // console.log('duck!');
                this.player.animations.stop();
                this.player.frame = 15;

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
                if(this.player.hasBaseball){
                    this.fire(this.baseball);
                }
                if(this.player.hasCat){
                    this.fire(this.actor.cat);
                }
            }

            if (this.game.controls.drop.isDown) {
                if(this.player.hasBaseball){
                    this.player.hasBaseball = false;
                    this.baseball.reset(this.player.x + 100, this.player.y - 80);

                }
                if(this.player.hasCat){
                    this.player.hasCat = false;
                    this.actor.cat.reset(this.player.x + 100, this.player.y - 80);
                }
            }



        }

    }
};

LD.Player.prototype.collectToy = function (toy) {
     if (this.player.hasCat){
            this.player.hasCat = false;
            this.actor.cat.reset(this.player.x + 100, this.player.y - 80);
        }
        toy.kill();
        this.player.hasBaseball = true;
        this.bug.flying = false;

};

LD.Player.prototype.collectCat = function (cat) {
        if (this.player.hasBaseball){
            this.player.hasBaseball = false;
            this.baseball.reset(this.player.x + 100, this.player.y - 80);
        }

        cat.kill();
        this.player.hasCat = true;
        this.bug.flying = false;

};


LD.Player.prototype.gameWin = function () {

};

LD.Player.prototype.fire = function (item) {
    if (this.player.hasBaseball) {
        this.player.hasBaseball = false;
        item.reset(this.player.x, this.player.y - 80);
        this.player.animations.play('throw');
        item.rotation = this.game.physics.arcade.moveToPointer(item, 1000, this.game.input.activePointer, 500);

    } else if (this.player.hasCat) {
        this.player.hasCat = false;
        this.actor.cat.walkTimer = null;
        item.reset(this.player.x, this.player.y - 80);
        this.player.animations.play('throw');
        this.actor.cat.attack.play();
        this.game.physics.arcade.moveToPointer(item, 600, this.game.input.activePointer, 500);

    }  else {

    }

};

LD.Player.prototype.pointers = function(){
  this.bug = this.bug || this.game.bug.bug;
  this.baseball = this.baseball || this.game.items.baseball;
  this.fan_top = this.fan_top || this.game.level.fan_top;
  this.platforms = this.platforms || this.game.level.platforms;
  this.player = this.player || this.game.player.player;
  this.actor = this.actor || this.game.actor;
};
