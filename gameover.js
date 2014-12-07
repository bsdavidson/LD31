"use strict";
LD.Gameover = function(game){};

LD.Gameover.prototype = {

    create: function () {
      console.log("create mainmenu");
      console.log(this.controls);
      // display images

    // add the button that will start the game

    this.add.sprite(0, 0, 'gameoverscreen');

    this.game.input.onDown.add(this.startGame, this);
    },

    startGame: function() {
      this.state.start('Menu');
    }

};
