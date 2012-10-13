// Generated by CoffeeScript 1.3.3
(function() {

  window.Vector = (function() {

    function Vector(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
      return this;
    }

    Vector.prototype.toJSON = function() {
      var json;
      json = {};
      json['x'] = this.x;
      json['y'] = this.y;
      json['heading'] = this.heading();
      return json;
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
      return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    Vector.prototype.toString = function() {
      return '(' + this.x + ', ' + this.y + ')';
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

  Vector.line_circle_intersection = function(vertex1, vertex2, circlePosition, radius) {
    var circleToMidpt, circleToVertex1, distSqToCenter, distToIntersection, dot, midpt, proj1, squared_radius, vertex1to2;
    vertex1to2 = Vector.subtract(vertex2, vertex1);
    circleToVertex1 = Vector.subtract(circlePosition, vertex1);
    dot = Vector.dot(vertex1to2, circleToVertex1);
    proj1 = Vector.multiply_scalar(vertex1to2, dot / vertex1to2.squared_magnitude());
    midpt = Vector.add(vertex1, proj1);
    circleToMidpt = Vector.subtract(midpt, circlePosition);
    distSqToCenter = circleToMidpt.squared_magnitude();
    distToIntersection;

    squared_radius = Math.pow(radius, 2);
    if (distSqToCenter > squared_radius) {
      return [];
    }
    if (distSqToCenter === squared_radius) {
      return [midpt];
    }
    if (distSqToCenter === 0) {
      distToIntersection = radius;
    } else {
      distToIntersection = Math.sqrt(squared_radius - distSqToCenter);
    }
    vertex1to2 = vertex1to2.normalize();
    vertex1to2.multiply_scalar(distToIntersection);
    return [Vector.add(midpt, vertex1to2), Vector.subtract(midpt, vertex1to2)];
  };

  Vector.ray_circle_intersection = function(vertex1, vertex2, circlePosition, radius) {
    var result, solutions, vertex1ToSolution1, vertex1ToSolution2, vertex1to2;
    result = [];
    vertex1to2 = Vector.subtract(vertex2, vertex1);
    solutions = Vector.line_circle_intersection(vertex1, vertex2, circlePosition, radius);
    vertex1ToSolution2;

    vertex1ToSolution1;

    if (solutions.length === 2) {
      vertex1ToSolution2 = Vector.subtract(solutions[1], vertex2);
      if (vertex1ToSolution2.dot(vertex1to2) > 0) {
        result.push(solutions[1]);
      }
    }
    if (solutions.length === 1) {
      vertex1ToSolution1 = Vector.subtract(solutions[0], vertex2);
      if (vertex1ToSolution1.dot(vertex1to2) > 0) {
        result.push(solutions[0]);
      }
    }
    return result;
  };

}).call(this);
