(function() {

  window.Bee = (function() {

    Bee.prototype.deceleration = 0.2;

    Bee.prototype.drag = 0.9;

    Bee.prototype.size = 64;

    Bee.prototype.is_flying = false;

    Bee.prototype.gravity = new SAT.Vector(0, 1);

    function Bee(options) {
      var x, y, _ref;
      this.options = options;
      _ref = this.options, x = _ref.x, y = _ref.y;
      this.position = this.last_position = new SAT.Vector(x, y);
      this.half_size = this.size / 2;
      this.velocity = new SAT.Vector();
      this.acceleration = new SAT.Vector();
      this.update_bounding_box();
    }

    Bee.prototype.update_bounding_box = function() {
      return this.bounding_box = (new SAT.Box(new SAT.Vector(this.position.x - this.half_size, this.position.y - this.half_size), this.size, this.size)).toPolygon();
    };

    Bee.prototype.update = function() {
      this.acceleration.scale(this.deceleration, this.deceleration);
      this.acceleration.add(this.gravity);
      this.velocity.add(this.acceleration);
      this.last_position = (new SAT.Vector()).copy(this.position);
      this.position.add(this.velocity);
      this.update_bounding_box();
      return this.velocity.scale(this.drag, this.drag);
    };

    Bee.prototype.render = function(helper) {
      if (this.is_flying) {
        this.update();
      }
      helper.fill('#000');
      helper.save();
      helper.translate(this.position.x, this.position.y);
      if (this.drag_dx) {
        helper.translate(this.drag_dx.x, this.drag_dx.y);
      }
      helper.rect(0, 0, this.size, this.size);
      return helper.restore();
    };

    return Bee;

  })();

}).call(this);
