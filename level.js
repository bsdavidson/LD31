(function() {
  'use strict';

  var SHOOTING_STAR = [8, 9, 10, 11, 12, 13];
  var TWINKLE = [0, 1, 2, 3, 4, 5, 6, 7];
  var FAN_SHAKE = [1, 2, 3, 4, 5, 6, 7, 0];
  var FAN_BREAK = [8, 9, 10, 11, 12];

  LD.Level = function(gameState) {
    this.gameState = gameState;
    this.game = gameState.game;
    this.layer = [];

    this.timer = this.game.time.now;
    this.map = this.game.add.tilemap('room');
    this.map.addTilesetImage('room_tiles', 'tiles');

    this.layer[0] = this.map.createLayer('Background');
    this.layer[1] = this.map.createLayer('Backwall');
    this.layer[2] = this.map.createLayer('Walls');
    this.layer[0].resizeWorld();

    this.platforms = this.game.make.group();
    this.platforms.enableBody = true;
    var floor = this.platforms.create(0, this.game.world.height - 32,
      'floor');
    var ceiling = this.platforms.create(0, 0, 'ceiling');

    ceiling.scale.setTo(100, 2);
    ceiling.body.immovable = true;
    floor.scale.setTo(100, 2);
    floor.body.immovable = true;

    this.fanTop = this.game.make.sprite(300, 0, 'fan_top');
    this.game.physics.arcade.enable(this.fanTop);
    this.fanTop.animations.add('spin', [0, 1, 2], 10, true);
    this.fanTop.animations.play('spin');
    this.fanTop.body.immovable = true;
    this.fanTop.body.setSize(180, 23, 0, 80);

    this.starscape = this.game.make.sprite(555, 200, 'stars');
    this.starscape.animations.add('twinkle', TWINKLE, 1, true);
    this.starscape.animations.add('shootingstar', SHOOTING_STAR, 20, false);
    this.game.world.addAt(this.starscape, 1);

    this.starscape.animations.play('twinkle');

    this.fanLight = this.game.make.sprite(330, 103, 'fan_light');
    this.game.physics.arcade.enable(this.fanLight);
    this.fanLight.body.immovable = true;
    this.fanLight.animations.add('shake', FAN_SHAKE, 10, false);
    this.fanLight.animations.add('break', FAN_BREAK, 10, false);
    this.fanLight.body.setSize(40, 23, 40, 0);
    this.fanLight.status = 'good'; // good or broken
    this.fanLight.frame = 0;

    this.bed = this.game.make.sprite(20, this.game.world.height - 130, 'bed');

    this.tv = this.game.make.sprite(330, this.game.world.height - 200, 'tv');
    this.game.physics.arcade.enable(this.tv);
    this.tv.body.immovable = true;
    this.tv.animations.add('zelda', [1, 2, 3, 4], 10, true);
    this.zelda = this.game.add.audio('zelda');
    this.tv.frame = 0;
    this.tv.inputEnabled = true;
    this.tv.events.onInputDown.add(this.tvActivate, this);
    this.tv.power = 'off';

    this.console = this.game.make.sprite(333, this.game.world.height - 110,
      'console');

    // this.game.physics.arcade.enable(this.fanLight);
    this.fanTop.body.immovable = true;

    this.powerBar = this.game.make.sprite(550, 8, 'health');
    this.bugHealth = this.game.make.sprite(60, 8, 'health');
  };

  LD.Level.prototype.add = function() {
    this.game.world.add(this.fanTop);
    this.game.world.add(this.platforms);
    this.game.world.add(this.starscape);
    this.game.world.add(this.fanLight);
    this.game.world.add(this.bed);
    this.game.world.add(this.tv);
    this.game.world.add(this.console);
    this.game.world.add(this.powerBar);
    this.game.world.add(this.bugHealth);
  };

  LD.Level.prototype.render = function() {
   //ddda this.gameState.game.debug.body(this.fanLight);
  };

  LD.Level.prototype.update = function(player) {
    this.updateShootingStar();
  };

  LD.Level.prototype.updateShootingStar = function() {
    var time = this.game.time.now - this.timer;
    if (time > 15000) {
      this.starscape.animations.play('shootingstar');
      this.timer = this.game.time.now;
    }
    this.starscape.events.onAnimationComplete.add(function() {
      this.starscape.animations.play('twinkle');
    }, this);
  };

  LD.Level.prototype.tvActivate = function() {
    if (this.tv.power === 'off') {
      this.tv.animations.play('zelda');
      this.zelda.play();
      this.tv.power = 'on';
    } else {
      this.tv.animations.stop();
      this.tv.frame = 0;
      this.tv.power = 'off';
      this.zelda.stop();
    }
  };
}());
