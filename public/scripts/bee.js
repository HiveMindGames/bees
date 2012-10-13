(function() {

  window.Bee = (function() {

    Bee.prototype.deceleration = 0.2;

    Bee.prototype.drag = 0.9;

    Bee.prototype.size = 64;

    Bee.prototype.is_flying = false;

    Bee.prototype.gravity = new Vector(0, 1);

    function Bee() {
      this.half_size = this.size / 2;
      this.position = new Vector();
      this.velocity = new Vector();
      this.acceleration = new Vector();
    }

    Bee.prototype.contains = function(mouse) {
      var x, y;
      x = mouse.x, y = mouse.y;
      return x > (this.position.x - this.half_size) && x < (this.position.x + this.half_size) && y > (this.position.y - this.half_size) && y < (this.position.y + this.half_size);
    };

    Bee.prototype.update = function() {
      this.acceleration.multiply_scalar(this.deceleration);
      if (this.is_flying) {
        this.acceleration.add(this.gravity);
      }
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      return this.velocity.multiply_scalar(this.drag);
    };

    Bee.prototype.render = function(helper) {
      this.update();
      helper.fill('#000');
      helper.save();
      helper.translate(this.position.x, this.position.y);
      helper.rect(0, 0, this.size, this.size);
      return helper.restore();
    };

    return Bee;

  })();

}).call(this);
