(function() {

  window.Bee = (function() {

    Bee.prototype.deceleration = 0.2;

    Bee.prototype.drag = 0.9;

    Bee.prototype.size = 64;

    Bee.prototype.is_flying = false;

    Bee.prototype.gravity = new SAT.Vector(0, 1);

    function Bee(position) {
      this.position = position != null ? position : new SAT.Vector();
      this.half_size = this.size / 2;
      this.velocity = new SAT.Vector();
      this.acceleration = new SAT.Vector();
      this.update_bounding_box();
    }

    Bee.prototype.contains = function(mouse) {
      var x, y;
      x = mouse.x, y = mouse.y;
      return x > (this.position.x - this.half_size) && x < (this.position.x + this.half_size) && y > (this.position.y - this.half_size) && y < (this.position.y + this.half_size);
    };

    Bee.prototype.update_bounding_box = function() {
      return this.bounding_box = (new SAT.Box(new SAT.Vector(this.position.x - this.half_size, this.position.y - this.half_size), this.size, this.size)).toPolygon();
    };

    Bee.prototype.update = function() {
      this.acceleration.scale(this.deceleration, this.deceleration);
      this.acceleration.add(this.gravity);
      this.velocity.add(this.acceleration);
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
      helper.rect(0, 0, this.size, this.size);
      return helper.restore();
    };

    return Bee;

  })();

}).call(this);
