(function() {

  window.Utils = {};

  window.Utils.degToRad = function(degrees) {
    return degrees * (Math.PI / 180);
  };

  window.Utils.radToDeg = function(radians) {
    return radians * (180 / Math.PI);
  };

}).call(this);
