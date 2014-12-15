(function() {
  'use strict';

  LD.GameWonState = function(game) {
    this.game = game;
  };

  LD.GameWonState.prototype = {
    create: function() {
      var displayText = this.game.deathType;
      this.add.sprite(0, 0, 'gamewonscreen');
      this.game.input.onDown.add(this.startGame, this);
    },

    startGame: function() {
      this.state.start('Menu');
    }
  };

  LD.GameWonCatState = function(game) {
    this.game = game;
  };

  LD.GameWonCatState.prototype = {
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
