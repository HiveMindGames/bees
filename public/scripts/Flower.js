(function() {

  window.Flower = (function() {

    Flower.prototype.precision = 10;

    Flower.prototype.stem_thickness = 10;

    function Flower(options) {
      var _ref;
      this.options = options != null ? options : {};
      _ref = this.options, this.final = _ref.final, this.src = _ref.src, this.width = _ref.width, this.height = _ref.height, this.position = _ref.position, this.stem_height = _ref.stem_height, this.angle = _ref.angle;
      this.image = new Image();
      this.image.src = this.src;
      this.half_stem_height = this.stem_height / 2;
      this.angle = Utils.degToRad(this.angle);
      this.half_width = this.width / 2;
      this.half_height = this.height / 2;
      this.petal_position = Utils.rotateVector(new SAT.Vector(0, -this.stem_height), this.angle).add(this.position);
      this.update_bounding_box();
    }

    Flower.prototype.contains = function(mouse) {
      var i, length, mousePos, pairs, point, points;
      mousePos = new SAT.Vector(mouse.x - this.mouse_box.pos.x, mouse.y - this.mouse_box.pos.y);
      points = this.mouse_box.points;
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
      var half_height, half_width, offset;
      half_width = this.half_width - this.precision;
      half_height = this.half_height - this.precision;
      offset = 20;
      this.bounding_box = new SAT.Polygon(this.petal_position, [Utils.rotateVector(new SAT.Vector(0, -half_height / 2 - offset), this.angle), Utils.rotateVector(new SAT.Vector(half_width, half_height - offset), this.angle), Utils.rotateVector(new SAT.Vector(-half_width, half_height - offset), this.angle)]);
      return this.mouse_box = new SAT.Polygon(this.petal_position, [Utils.rotateVector(new SAT.Vector(-half_width, -half_height), this.angle), Utils.rotateVector(new SAT.Vector(half_width, -half_height), this.angle), Utils.rotateVector(new SAT.Vector(half_width, half_height), this.angle), Utils.rotateVector(new SAT.Vector(-half_width, half_height), this.angle)]);
    };

    Flower.prototype.is_back_normal = function(vec) {
      var normal;
      normal = Utils.rotateVector(new SAT.Vector(0, 1), this.angle);
      return (vec.x * normal.x + normal.y * vec.y) > 0;
    };

    Flower.prototype.render = function(helper) {
      var stem_color;
      helper.save();
      stem_color = '#080';
      helper.context.lineCap = 'round';
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
      if (this.drag_dx) {
        helper.translate(this.drag_dx.x, this.drag_dx.y);
      }
      helper.translate(this.position.x, this.position.y);
      helper.rotate(this.angle);
      helper.translate(0, -this.stem_height);
      helper.render_image(this.image, -this.half_width, -this.half_height, this.width, this.height);
      return helper.restore();
    };

    return Flower;

  })();

}).call(this);
