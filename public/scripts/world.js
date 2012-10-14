(function() {

  window.World = (function() {

    function World(helper, options) {
      var init_mouse, is_dragging, mouse, mouse_dx,
        _this = this;
      this.helper = helper;
      this.options = options;
      this.background = new Background(this.options.backgrounds);
      this.new_game();
      mouse = new SAT.Vector();
      init_mouse = new SAT.Vector();
      is_dragging = false;
      mouse_dx = null;
      $(this.helper.canvas).on('mousedown', function(e) {
        if (!_this.current_flower) {
          return;
        }
        init_mouse.x = mouse.x = e.clientX;
        init_mouse.y = mouse.y = e.clientY;
        return is_dragging = _this.current_flower.contains(mouse);
      });
      $(this.helper.canvas).on('mouseup', function(e) {
        if (!is_dragging) {
          return;
        }
        is_dragging = false;
        _this.bee.is_flying = true;
        _this.current_flower.drag_position = null;
        _this.current_flower.drag_dx = null;
        _this.bee.drag_dx = null;
        if (mouse_dx) {
          return _this.bee.acceleration.sub(mouse_dx);
        }
      });
      $(this.helper.canvas).on('mousemove', function(e) {
        if (!is_dragging) {
          return;
        }
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse);
        _this.current_flower.drag_position = mouse;
        _this.current_flower.drag_dx = mouse_dx;
        return _this.bee.drag_dx = mouse_dx;
      });
    }

    World.prototype.new_game = function() {
      var background, option, poly, _i, _len, _ref;
      _ref = this.options.backgrounds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        background = _ref[_i];
        background.x = 0;
      }
      this.bee = new Bee(this.options.bee);
      this.flowers = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.options.flowers;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          option = _ref1[_j];
          _results.push(new Flower(option));
        }
        return _results;
      }).call(this);
      this.current_flower = this.flowers[0];
      return this.obstacles = (function() {
        var _j, _len1, _ref1, _results;
        _ref1 = this.options.obstacles;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          poly = _ref1[_j];
          _results.push(new Obstacle(poly));
        }
        return _results;
      }).call(this);
    };

    World.prototype.update = function(helper) {
      var background, collision_response, current_obstacle, offset, _i, _len, _ref,
        _this = this;
      if (!this.bee.is_flying) {
        return;
      }
      _ref = this.options.backgrounds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        background = _ref[_i];
        background.x += (this.bee.last_position.x - this.bee.position.x) * background.increment;
        if (background.x + background.width < helper.width) {
          background.x += background.width;
        }
        if (background.x > 0) {
          background.x -= background.width;
        }
      }
      collision_response = null;
      this.current_flower = _.find(this.flowers, function(flower) {
        var has_collided;
        if (flower === _this.current_flower) {
          return false;
        }
        has_collided = SAT.testPolygonPolygon(_this.bee.bounding_box, flower.bounding_box, collision_response = new SAT.Response());
        return has_collided;
      });
      if (this.current_flower) {
        this.bee.is_flying = false;
        offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse();
        this.bee.position.add(offset);
        this.bee.velocity.add(offset);
      }
      current_obstacle = _.find(this.obstacles, function(obstacle) {
        return SAT.testPolygonPolygon(_this.bee.bounding_box, obstacle.poly, collision_response = new SAT.Response());
      });
      if (current_obstacle) {
        this.bee.velocity.reflectN(collision_response.overlapN.perp());
      }
      if (this.bee.position.y > this.helper.height) {
        return this.new_game();
      }
    };

    World.prototype.render = function(helper) {
      this.update(helper);
      this.background.render(helper);
      _.invoke(this.flowers, 'render', helper);
      _.invoke(this.obstacles, 'render', helper);
      return this.bee.render(helper);
    };

    return World;

  })();

}).call(this);
