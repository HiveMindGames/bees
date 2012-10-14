(function() {

  window.Bee = (function() {

    Bee.prototype.precision = 10;

    Bee.prototype.drag = 0.1;

    Bee.prototype.is_flying = false;

    Bee.prototype.distance = 0;

    Bee.prototype.gravity = new SAT.Vector(0, 900);

    function Bee(options) {
      var x, y, _ref;
      this.options = options;
      _ref = this.options, this.src = _ref.src, this.width = _ref.width, this.height = _ref.height, x = _ref.x, y = _ref.y;
      this.half_width = this.width / 2;
      this.half_height = this.height / 2;
      this.image = new Image();
      this.image.src = this.src;
      this.position = this.last_position = new SAT.Vector(x, y);
      this.velocity = new SAT.Vector();
      this.acceleration = new SAT.Vector();
      this.update_bounding_box();
    }

    Bee.prototype.update_bounding_box = function() {
      return this.bounding_box = (new SAT.Box(new SAT.Vector(this.position.x - this.half_width + this.precision, this.position.y - this.half_height + this.precision), this.width - this.precision, this.height - this.precision)).toPolygon();
    };

    Bee.prototype.simulate = function(dt) {
      var da, db, dc, dd, dpos;
      if (!this.is_flying) {
        return;
      }
      da = this.evaluate(0.0, null);
      db = this.evaluate(dt * 0.5, da);
      dc = this.evaluate(dt * 0.5, db);
      dd = this.evaluate(dt, dc);
      da.dpos.add(db.dpos.add(dc.dpos).scale(2)).add(dd.dpos).scale(1 / 6);
      da.dvel.add(db.dvel.add(dc.dvel).scale(2)).add(dd.dvel).scale(1 / 6);
      dpos = da.dpos.scale(dt);
      this.distance += dpos.len();
      this.last_position = (new SAT.Vector()).copy(this.position);
      this.position.add(dpos);
      this.velocity.add(da.dvel.scale(dt));
      return this.update_bounding_box();
    };

    Bee.prototype.evaluate = function(dt, deriv) {
      var initial_pos, initial_vel;
      initial_pos = (new SAT.Vector()).copy(this.position);
      initial_vel = (new SAT.Vector()).copy(this.velocity);
      if (deriv) {
        initial_pos.add((new SAT.Vector()).copy(deriv.dpos).scale(dt));
        initial_vel.add((new SAT.Vector()).copy(deriv.dvel).scale(dt));
      }
      return {
        dpos: (new SAT.Vector()).copy(initial_vel),
        dvel: (new SAT.Vector()).copy(this.gravity).sub((new SAT.Vector()).copy(initial_vel).scale(this.drag))
      };
    };

    Bee.prototype.render = function(helper) {
      helper.save();
      helper.translate(this.position.x, this.position.y);
      if (this.drag_dx) {
        helper.translate(this.drag_dx.x, this.drag_dx.y);
      }
      helper.render_image(this.image, -this.half_width, -this.half_height, this.width, this.height);
      return helper.restore();
    };

    return Bee;

  })();

}).call(this);
