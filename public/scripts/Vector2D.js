(function() {

  window.Vector = (function() {

    function Vector(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      return this;
    }

    Vector.prototype.toJSON = function() {
      return {
        x: this.x,
        y: this.y
      };
    };

    Vector.prototype.toString = function() {
      return "(" + this.x + "," + this.y + ")";
    };

    Vector.prototype.copy = function() {
      return new Vector(this.x, this.y);
    };

    Vector.prototype.add = function(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    };

    Vector.prototype.subtract = function(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    };

    Vector.prototype.multiply_scalar = function(val) {
      this.x *= val;
      this.y *= val;
      return this;
    };

    Vector.prototype.add_scalar = function(val) {
      this.x += val;
      this.y += val;
      return this;
    };

    Vector.prototype.subtract_scalar = function(val) {
      this.x -= val;
      this.y -= val;
      return this;
    };

    Vector.prototype.rotate = function(radians) {
      var new_x, new_y;
      new_x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
      new_y = this.x * Math.sin(radians) + this.y * Math.cos(radians);
      this.x = new_x;
      this.y = new_y;
      return this;
    };

    Vector.prototype.dot = function(v) {
      return this.x * v.x + this.y * v.y;
    };

    Vector.prototype.heading = function() {
      var copy;
      copy = this.copy().normalize();
      return -1 * Math.atan2(-copy.y, copy.x);
    };

    Vector.prototype.normalize = function() {
      var magnitude;
      magnitude = this.magnitude();
      if (magnitude !== 0) {
        this.x /= magnitude;
        this.y /= magnitude;
      }
      return this;
    };

    Vector.prototype.squared_magnitude = function() {
      return this.x * this.x + this.y * this.y;
    };

    Vector.prototype.magnitude = function() {
      return Math.sqrt(this.squared_magnitude());
    };

    return Vector;

  })();

  Vector.copy = function(v) {
    return new Vector(v.x, v.y);
  };

  Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  };

  Vector.subtract = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  };

  Vector.multiply_scalar = function(v, val) {
    return new Vector(v.x * val, v.y * val);
  };

  Vector.divide_scalar = function(v, val) {
    return new Vector(v.x / val, v.y / val);
  };

  Vector.add_scalar = function(v, val) {
    return new Vector(v.x + val, v.y + val);
  };

  Vector.subtract_scalar = function(v, val) {
    return new Vector(v.x - val, v.y - val);
  };

  Vector.rotate = function(v, radians) {
    var new_x, new_y;
    new_x = v.x * Math.cos(radians) - v.y * Math.sin(radians);
    new_y = v.x * Math.sin(radians) + v.y * Math.cos(radians);
    return new Vector(new_x, new_y);
  };

  Vector.dot = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  };

  Vector.distance = function(v1, v2) {
    return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
  };

  Vector.squared_distance = function(v1, v2) {
    return Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2);
  };

  Vector.normalize = function(v) {
    var magnitude;
    v = v.copy();
    magnitude = v.magnitude();
    if (magnitude(!0)) {
      v.x /= magnitude;
      v.y /= magnitude;
    }
    return v;
  };

}).call(this);
