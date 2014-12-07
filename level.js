"use strict";
var Level = function(game){
  this.game = game;
  this.layer = [];
  this.bugTimer = null;
  this.platforms;
};



Level.prototype = {

    preload: function () {

      this.game.stage.backgroundColor = '#DDDDDD';
      this.game.load.image('tiles', 'assets/room_tiles.png');
      this.game.load.image('floor', 'assets/carpet_tile.png');
      this.game.load.image('ceiling', 'assets/ceiling_tile.png');
      this.game.load.spritesheet('fan_top', 'assets/fan_top.png', 192, 102);
      this.game.load.image('fan_light', 'assets/fan_light.png');
      this.game.load.spritesheet('bug_ani', 'assets/little_bug_ani.png', 24, 24);

      this.game.load.tilemap('room', 'assets/room_tiled.json', null, Phaser.Tilemap.TILED_JSON);


    },

    create: function () {

      this.map = game.add.tilemap('room');
      this.map.addTilesetImage('room_tiles', 'tiles');

      this.layer[0] = this.map.createLayer('Background');
      this.layer[1] = this.map.createLayer('Backwall');
      this.layer[2] = this.map.createLayer('Walls');

      // this.layer[2] = this.map.createLayer('Walls');
      // this.layer[2].debug = true;
       //this.game.physics.arcade.enable(this.layer[2], Phaser.Physics.ARCADE, true);
       this.layer[0].resizeWorld();
      // this.map.setCollisionBetween(0,1,true,this.layer[2]);

      this.platforms = game.add.group();
      this.platforms.enableBody = true;
      var floor = this.platforms.create(0, this.game.world.height - 32, 'floor');
      var ceiling = this.platforms.create(0, 0, 'ceiling');

      ceiling.scale.setTo(100, 2);
      ceiling.body.immovable = true;
      floor.scale.setTo(100, 2);
      floor.body.immovable = true;

      this.fan_top = this.game.add.sprite(300, 0, 'fan_top');
      this.game.physics.arcade.enable(this.fan_top);
      this.fan_top.animations.add('spin', [0, 1, 2], 10, true);
      this.fan_top.animations.play('spin');
      this.fan_top.body.immovable = true;

      this.fan_light = this.game.add.sprite(330, 104, 'fan_light');
      this.game.physics.arcade.enable(this.fan_light);
      this.fan_top.body.immovable = true;

      this.bug = this.game.add.sprite(90, 400, 'bug_ani');
      this.bug.flying = false;
      this.bug.animations.add('walk', [0, 1], 10, true);
      this.bug.animations.add('fly', [3, 4], 10, true);
      this.bug.animations.add('stop', [0], 10, true);
      this.bug.animations.play('walk');
      this.bug.debug = true;
      this.game.physics.arcade.enable(this.bug);
      this.bug.anchor.setTo(0.5, 0.5);
      this.bug.body.collideWorldBounds = true;
      this.bug.body.bounce.y = 0;
      this.bug.body.bounce.x = 0.4;
      this.bug.body.gravity.y = -400;

    },

    update: function(player) {



      //console.log('level update?');
    }

};
