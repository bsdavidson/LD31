"use strict";
LD.Game = function(game){
};
LD.Game.prototype = {

    create: function () {
      console.log(this);
      this.level = new LD.Level(this);
      this.level.create();

      this.bug = new LD.Bug(this);
      this.bug.create();

      this.player = new LD.Player(this, 30, 120);
      this.player.create();
    },

    update: function () {
      this.level.update();
      this.player.update();
      this.bug.update();
    }

};
