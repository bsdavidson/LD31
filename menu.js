"use strict";
LD.Menu = function (game) {};

LD.Menu.prototype = {

  create: function () {

    this.add.sprite(0, 0, 'titlescreen');

    this.game.input.onDown.add(this.startGame, this);
  },

  startGame: function () {
    this.state.start('Game');
  }

};
