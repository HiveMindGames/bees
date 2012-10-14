(function() {

  window.World = (function() {

    function World(helper, options) {
      var init_mouse, is_dragging, mouse, mouse_dx, option,
        _this = this;
      this.helper = helper;
      this.options = options;
      this.bee = new Bee(this.options.bee);
      this.flowers = (function() {
        var _i, _len, _ref, _results;
        _ref = this.options.flowers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          option = _ref[_i];
          _results.push(new Flower(option));
        }
        return _results;
      }).call(this);
      this.current_flower = this.flowers[0];
      init_mouse = new SAT.Vector();
      mouse = new SAT.Vector();
      is_dragging = false;
      mouse_dx = null;
      $(this.helper.canvas).on('mousedown', function(e) {
        init_mouse.x = mouse.x = e.clientX;
        init_mouse.y = mouse.y = e.clientY;
        return is_dragging = _this.bee.contains(mouse);
      });
      $(this.helper.canvas).on('mouseup', function(e) {
        if (is_dragging) {
          is_dragging = false;
          _this.bee.is_flying = true;
          return _this.bee.acceleration.sub(mouse_dx);
        }
      });
      $(this.helper.canvas).on('mousemove', function(e) {
        if (!is_dragging) {
          return;
        }
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        return mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse);
      });
    }

    World.prototype.update = function() {
      var collision_response, offset,
        _this = this;
      if (!this.bee.is_flying) {
        return;
      }
      collision_response = null;
      this.current_flower = _.find(this.flowers, function(flower) {
        if (flower === _this.current_flower) {
          return false;
        }
        return SAT.testPolygonPolygon(_this.bee.bounding_box, flower.bounding_box, collision_response = new SAT.Response());
      });
      if (this.current_flower) {
        this.bee.is_flying = false;
        offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse();
        this.bee.position.add(offset);
        return this.bee.velocity.add(offset);
      }
    };

    World.prototype.render = function(helper) {
      _.invoke(this.flowers, 'render', helper);
      this.bee.render(helper);
      return this.update();
    };

    return World;

  })();

}).call(this);
