"use strict";

LD.Level = function (game) {
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



        this.fan_light = this.game.add.sprite(330, 104, 'fan_light');
        this.game.physics.arcade.enable(this.fan_light);
        this.fan_top.body.immovable = true;

        this.tv = this.game.add.sprite(330, this.game.world.height - 200, 'tv');
        this.console = this.game.add.sprite(333, this.game.world.height - 110, 'console');

        // this.game.physics.arcade.enable(this.fan_light);
        this.fan_top.body.immovable = true;

    },

    update: function (player) {
       this.bug = this.bug || this.game.bug.bug;
        this.baseball = this.baseball || this.game.items.baseball;
        this.fan_top = this.fan_top || this.game.level.fan_top;
        this.platforms = this.platforms || this.game.level.platforms;
        this.player = this.player || this.game.player.player;
        this.actor = this.actor || this.game.actor;




        //console.log('level update?');
    }
};
