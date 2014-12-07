"use strict";
LD.Menu = function(game){};

LD.Menu.prototype = {

    create: function () {

      // display images

    // add the button that will start the game

    this.add.sprite(0, 0, 'titlescreen');

    this.game.input.onDown.add(this.startGame, this);
    },

    startGame: function() {
      this.state.start('Game');
    }

};
