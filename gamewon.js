(function() {
  'use strict';

  LD.GameWon = function(game) {
    this.game = game;
  };

  LD.GameWon.prototype = {
    create: function() {
      var displayText = this.game.deathType;
      this.add.sprite(0, 0, 'gamewonscreen');
      // display images
      // add the button that will start the game
      this.game.input.onDown.add(this.startGame, this);
    },

    startGame: function() {
      this.state.start('Menu');
    }
  };

  LD.GameWonCat = function(game) {
    this.game = game;
  };

  LD.GameWonCat.prototype = {
    create: function() {
      var displayText = this.game.deathType;
      this.add.sprite(0, 0, 'gamewonscreencat');
      this.game.input.onDown.add(this.startGame, this);
    },

    startGame: function() {
      this.state.start('Menu');
    }
  };
}());
