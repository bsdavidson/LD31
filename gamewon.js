"use strict";
LD.Gamewon = function(game){};

LD.Gamewon.prototype = {

    create: function () {
      console.log("create mainmenu");
      console.log(this.controls);
      // display images

    // add the button that will start the game

    this.add.sprite(0, 0, 'titlescreen');

    this.add.button(LD.GAME_WIDTH-401-10, LD.GAME_HEIGHT-143-10, 'button-start', this.startGame, this, 1, 0, 2);

    },

    startGame: function() {
      this.state.start('Game');
    }

};
