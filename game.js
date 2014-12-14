(function() {
  'use strict';

  LD.Game = function(game) {};

  LD.Game.prototype = {
    create: function() {
      this.level = new LD.Level(this);
      this.bug = new LD.Bug(this);
      this.player = new LD.Player(this, 30, 120);
      this.cat = new LD.Cat(this, 30, 120);
      this.items = new LD.Items(this);

      this.level.create();
      this.game.world.add(this.bug);
      this.game.world.add(this.bug.healthText);
      this.game.world.add(this.cat);
      this.items.create();
      this.player.create();
    },

    update: function() {
      this.level.update();
      this.cat.update();
      this.player.update();
      this.bug.update();
      this.items.update();
    },

    render: function() {
      this.level.render();
    }
  };
}());
