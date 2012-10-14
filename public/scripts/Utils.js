(function() {

  window.Utils = {
    degToRad: function(degrees) {
      return degrees * (Math.PI / 180);
    },
    radToDeg: function(radians) {
      return radians * (180 / Math.PI);
    },
    rotateVector: function(vector, radians) {
      var x, y;
      x = vector.x * Math.cos(radians) - vector.y * Math.sin(radians);
      y = vector.x * Math.sin(radians) + vector.y * Math.cos(radians);
      vector.x = x;
      vector.y = y;
      return vector;
    }
  };

}).call(this);
