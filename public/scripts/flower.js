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
      this.petal_position = Utils.rotateVector(new SAT.Vector(0, -this.stem_height), this.angle).add(this.position);
      this.update_bounding_box();
    }

    Flower.prototype.contains = function(mouse) {
      var i, length, mousePos, pairs, point, points;
      mousePos = new SAT.Vector(mouse.x - this.bounding_box.pos.x, mouse.y - this.bounding_box.pos.y);
      points = this.bounding_box.points;
      length = points.length;
      pairs = (function() {
        var _i, _len, _results;
        _results = [];
        for (i = _i = 0, _len = points.length; _i < _len; i = ++_i) {
          point = points[i];
          _results.push([point, points[(i + 1) % length]]);
        }
        return _results;
      })();
      return _.every(pairs, function(pair) {
        var edge, to_mouse;
        edge = (new SAT.Vector()).copy(pair[1]).sub(pair[0]);
        to_mouse = (new SAT.Vector()).copy(pair[1]).sub(mousePos);
        return (edge.x * to_mouse.y - to_mouse.x * edge.y) < 0;
      });
    };

    Flower.prototype.update_bounding_box = function() {
      this.bounding_box = new SAT.Polygon(this.petal_position, [Utils.rotateVector(new SAT.Vector(-this.half_petal_width, -this.half_petal_height), this.angle), Utils.rotateVector(new SAT.Vector(this.half_petal_width, -this.half_petal_height), this.angle), Utils.rotateVector(new SAT.Vector(this.half_petal_width, this.half_petal_height), this.angle), Utils.rotateVector(new SAT.Vector(-this.half_petal_width, this.half_petal_height), this.angle)]);
      return this.bounding_box.recalc();
    };

    Flower.prototype.render = function(helper) {
      var stem_color;
      helper.save();
      stem_color = '#080';
      if (this.drag_position) {
        helper.context.beginPath();
        helper.context.moveTo(this.position.x, this.position.y);
        helper.context.quadraticCurveTo(this.petal_position.x, this.petal_position.y, this.drag_position.x, this.drag_position.y);
        helper.stroke_width(10);
        helper.stroke(stem_color);
        helper.context.stroke();
        helper.no_stroke();
      } else {
        helper.fill('#080');
        helper.translate(this.position.x, this.position.y);
        helper.rotate(this.angle);
        helper.rect(0, -this.half_stem_height, this.stem_thickness, this.stem_height);
      }
      helper.restore();
      helper.save();
      helper.fill('#ee0');
      if (this.drag_dx) {
        helper.translate(this.drag_dx.x, this.drag_dx.y);
      }
      helper.translate(this.position.x, this.position.y);
      helper.rotate(this.angle);
      helper.translate(0, -this.stem_height);
      helper.rect(0, 0, this.petal_width, this.petal_height);
      return helper.restore();
    };

    return Flower;

  })();

}).call(this);
