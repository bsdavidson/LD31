(function() {
  'use strict';

  LD.GameState = function(game) {
    this.game = game;
  };

  LD.GameState.prototype = {
    create: function() {
      this.level = new LD.Level(this);

      this.baseball = new LD.Baseball(this);
      this.bug = new LD.Bug(this);
      this.cat = new LD.Cat(this);
      this.waterGun = new LD.WaterGun(this);

      this.holdable = [
        this.baseball,
        this.cat,
        this.waterGun
      ];

      this.throwable = [
        this.baseball,
        this.cat
      ];

      this.player = new LD.Player(this);

      this.level.add();
      this.game.world.add(this.bug);
      this.game.world.add(this.bug.healthText);
      this.game.world.add(this.cat);
      this.game.world.add(this.baseball);
      this.game.world.add(this.waterGun);
      this.game.world.add(this.waterGun.emitter);
      this.game.world.add(this.player);
    },

    render: function() {
      this.level.render();
    },

    update: function() {
      this.level.update();
    }
  };
}());
