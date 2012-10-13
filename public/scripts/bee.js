(function() {

  window.Bee = (function() {

    Bee.prototype.deceleration = 0.15;

    Bee.prototype.drag = 0.9;

    Bee.prototype.size = 8;

    Bee.prototype.half_size = 4;

    function Bee() {
      this.gravity = new Vector(0, 1);
      this.position = new Vector();
      this.velocity = new Vector();
      this.acceleration = new Vector();
    }

    Bee.prototype.update = function() {
      this.acceleration.multiply_scalar(this.deceleration);
      this.acceleration.add(this.gravity);
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      return this.velocity.multiply_scalar(this.drag);
    };

    Bee.prototype.render = function(helper) {
      var x, y, _ref;
      this.update();
      _ref = this.position, x = _ref.x, y = _ref.y;
      helper.fill('#000');
      helper.save();
      helper.translate(x - this.half_size, y - this.half_size);
      helper.rect(0, 0, this.size, this.size);
      return helper.restore();
    };

    return Bee;

  })();

}).call(this);
