(function() {
  'use strict';

  LD.GameState = function(game) {
    this.game = game;
  };

  LD.GameState.prototype = {
    create: function() {
      this.level = new LD.Level(this);
      this.bug = new LD.Bug(this);
      this.player = new LD.Player(this);
      this.cat = new LD.Cat(this);
      this.baseball = new LD.Baseball(this);

      this.level.add();
      this.game.world.add(this.bug);
      this.game.world.add(this.bug.healthText);
      this.game.world.add(this.cat);
      this.game.world.add(this.baseball);
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
