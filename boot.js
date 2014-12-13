LD = (function() {
  'use strict';

  var LD = {};

  LD.Boot = function() {};

  LD.Boot.prototype = {
    preload: function() {
      console.log('boot preload');
    },

    create: function() {
      console.log('boot create');
      this.state.start('Preloader');
    }
  };

  return LD;
}());
