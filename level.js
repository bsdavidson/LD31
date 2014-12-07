"use strict";

LD.Level = function(game){
  this.game = game;
  this.layer = [];
  this.platforms;
};



LD.Level.prototype = {


    create: function () {

      this.map = this.game.add.tilemap('room');
      this.map.addTilesetImage('room_tiles', 'tiles');

      this.layer[0] = this.map.createLayer('Background');
      this.layer[1] = this.map.createLayer('Backwall');
      this.layer[2] = this.map.createLayer('Walls');
      this.layer[0].resizeWorld();

      this.platforms = this.game.add.group();
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

        this.cat = this.game.add.sprite(300, this.game.world.height - 80, 'cat');
        this.game.physics.arcade.enable(this.cat);
        this.cat.body.collideWorldBounds = true;
        this.cat.body.bounce.y = 0.0;
        this.cat.body.bounce.x = 0.0;
        this.cat.body.gravity.y = 700;
        this.cat.body.drag.x = 100;
        this.cat.body.drag.y = 100;
        this.cat.animations.add('sit', [0, 0, 0, 0, 4], 3, true);
        this.cat.animations.add('swish', [0, 1, 2, 3, 2, 1, 0, 0], 10, true);
        this.cat.animations.add('walk', [5, 6, 7, 8, 9], 7, true);
        this.cat.animations.add('pounce', [10], 10, true);
        this.cat.animations.add('eat', [11, 12], 10, true);


      this.cat.animations.play('sit');
      this.game.physics.arcade.enable(this.cat);


      this.fan_light = this.game.add.sprite(330, 104, 'fan_light');
      this.game.physics.arcade.enable(this.fan_light);
      this.fan_top.body.immovable = true;

      this.tv = this.game.add.sprite(330, this.game.world.height - 200, 'tv');
      // this.game.physics.arcade.enable(this.fan_light);
      this.fan_top.body.immovable = true;

    },

    update: function(player) {
      this.game.physics.arcade.collide(this.cat, this.platforms);


      //console.log('level update?');
    }
};

