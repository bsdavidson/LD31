"use strict";
LD.Gameover = function(game){};

LD.Gameover.prototype = {

    create: function () {

    this.add.sprite(0, 0, 'gameoverscreen');

    this.game.input.onDown.add(this.startGame, this);
    },

    startGame: function() {
      this.state.start('Menu');
    }

};
