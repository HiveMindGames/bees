(function() {

  window.Flower = (function() {

    Flower.prototype.stem_thickness = 10;

    function Flower(options) {
      var _ref;
      this.options = options != null ? options : {};
      _ref = this.options, this.petal_width = _ref.petal_width, this.petal_height = _ref.petal_height, this.position = _ref.position, this.stem_height = _ref.stem_height, this.angle = _ref.angle;
      this.half_stem_height = this.stem_height / 2;
      this.angle = Utils.degToRad(this.angle);
      this.half_petal_width = this.petal_width / 2;
      this.half_petal_height = this.petal_height / 2;
      this.update_bounding_box();
    }

    Flower.prototype.contains = function(mouse) {
      var i, inside, intersect, length, max, points, x, xi, xj, y, yi, yj;
      x = mouse.x, y = mouse.y;
      inside = false;
      points = this.bounding_box.points;
      length = points.length;
      max = length - 2;
      i = 0;
      while (i < length) {
        xi = points[i].x;
        yi = points[i].y;
        xj = points[max].x;
        yj = points[max].y;
        console.warn(xi, yi, xj, yj);
        intersect = (((yi > y && y !== yj) && yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        console.warn('intersect', intersect);
        if (intersect) {
          inside = !inside;
        }
        max = i++;
      }
      console.warn('inside', inside);
      return inside;
    };

    Flower.prototype.update_bounding_box = function() {
      this.rotated_position = Utils.rotateVector(new SAT.Vector(0, -this.stem_height), this.angle);
      this.bounding_box = new SAT.Polygon(new SAT.Vector(this.position.x + this.rotated_position.x, this.position.y + this.rotated_position.y), [Utils.rotateVector(new SAT.Vector(-this.half_petal_width, -this.half_petal_height), this.angle), Utils.rotateVector(new SAT.Vector(this.half_petal_width, -this.half_petal_height), this.angle), Utils.rotateVector(new SAT.Vector(-this.half_petal_width, this.half_petal_height), this.angle), Utils.rotateVector(new SAT.Vector(this.half_petal_width, this.half_petal_height), this.angle)]);
      return this.bounding_box.recalc();
    };

    Flower.prototype.render = function(helper) {
      helper.fill('#080');
      helper.save();
      helper.translate(this.position.x, this.position.y);
      helper.rotate(this.angle);
      helper.rect(0, -this.half_stem_height, this.stem_thickness, this.stem_height);
      helper.fill('#ee0');
      helper.translate(0, -this.stem_height);
      helper.rect(0, 0, this.petal_width, this.petal_height);
      return helper.restore();
    };

    return Flower;

  })();

}).call(this);
