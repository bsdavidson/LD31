(function() {
  'use strict';

  LD.Level = function(game) {
    this.game = game;
    this.layer = [];
  };

  var TWINKLE = [0, 1, 2, 3, 4, 5, 6, 7];
  var SHOOTINGSTAR = [8, 9, 10, 11, 12, 13];

  LD.Level.prototype = {
    create: function() {
      this.timer = this.game.time.now;
      this.map = this.game.add.tilemap('room');
      this.map.addTilesetImage('room_tiles', 'tiles');

      this.layer[0] = this.map.createLayer('Background');
      this.layer[1] = this.map.createLayer('Backwall');
      this.layer[2] = this.map.createLayer('Walls');
      this.layer[0].resizeWorld();

      this.platforms = this.game.add.group();
      this.platforms.enableBody = true;
      var floor = this.platforms.create(0, this.game.world.height - 32,
        'floor');
      var ceiling = this.platforms.create(0, 0, 'ceiling');

      ceiling.scale.setTo(100, 2);
      ceiling.body.immovable = true;
      floor.scale.setTo(100, 2);
      floor.body.immovable = true;

      this.fanTop = this.game.add.sprite(300, 0, 'fan_top');
      this.game.physics.arcade.enable(this.fanTop);
      this.fanTop.animations.add('spin', [0, 1, 2], 10, true);
      this.fanTop.animations.play('spin');
      this.fanTop.body.immovable = true;
      this.fanTop.body.setSize(180, 23, 0, 80);

      this.starscape = this.game.add.sprite(555, 200, 'stars');
      this.starscape.animations.add('twinkle', TWINKLE, 1, true);
      this.starscape.animations.add('shootingstar', SHOOTINGSTAR, 20, false);
      this.game.world.addAt(this.starscape, 1);

      this.starscape.animations.play('twinkle');

      this.fanLight = this.game.add.sprite(330, 104, 'fan_light');
      this.game.physics.arcade.enable(this.fanLight);
      this.fanTop.body.immovable = true;

      this.bed = this.game.add.sprite(20, this.game.world.height - 130, 'bed');
      this.tv = this.game.add.sprite(330, this.game.world.height - 200, 'tv');
      this.console = this.game.add.sprite(333, this.game.world.height - 110,
        'console');

      // this.game.physics.arcade.enable(this.fanLight);
      this.fanTop.body.immovable = true;
    },

    update: function(player) {
      this.shootingStar();
      this.bug = this.bug || this.game.bug;
      this.baseball = this.baseball || this.game.baseball;
      this.fanTop = this.fanTop || this.game.level.fanTop;
      this.platforms = this.platforms || this.game.level.platforms;
      this.player = this.player || this.game.player.player;
      this.actor = this.actor || this.game.actor;
    },

    render: function() {
      // this.game.game.debug.body(this.bug);
    }
  };

  LD.Level.prototype.shootingStar = function() {
    var time = this.game.time.now - this.timer;
    if (time > 15000) {
      this.starscape.animations.play('shootingstar');
      this.timer = this.game.time.now;
    }
    this.starscape.events.onAnimationComplete.add(function() {
      this.starscape.animations.play('twinkle');
    }, this);
  };
}());
