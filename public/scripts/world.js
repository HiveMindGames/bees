(function() {

  window.World = (function() {

    World.prototype.is_dragging = false;

    World.prototype.bounce_factor = 0.9;

    function World(helper, options) {
      var init_mouse, mouse, mouse_dx,
        _this = this;
      this.helper = helper;
      this.options = options;
      this.background = new CompositeBackground(this.options.backgrounds);
      this.reset_game();
      this.translation = new SAT.Vector();
      mouse = new SAT.Vector();
      init_mouse = new SAT.Vector();
      mouse_dx = null;
      $('#replay').on('click', function(e) {
        e.preventDefault();
        return _this.reset_game();
      });
      $(this.helper.canvas).on('mousedown', function(e) {
        if (!_this.current_flower) {
          return;
        }
        init_mouse.x = mouse.x = e.clientX;
        init_mouse.y = mouse.y = e.clientY;
        _this.is_dragging = _this.current_flower.contains(mouse);
        if (_this.is_dragging) {
          _this.bee.position.x = _this.current_flower.bounding_box.pos.x;
          _this.bee.position.y = _this.current_flower.bounding_box.pos.y - _this.current_flower.half_petal_height;
          return soundManager.play('stretch');
        }
      });
      $(this.helper.canvas).on('mouseup', function(e) {
        if (!_this.is_dragging) {
          return;
        }
        soundManager.play("bounce" + (Math.floor(Math.random() * 3) + 1));
        soundManager.play('buzz', {
          loops: 3
        });
        soundManager.stop('stretch');
        soundManager.play('spring');
        _this.is_dragging = false;
        _this.bee.is_flying = true;
        _this.current_flower.drag_position = null;
        _this.current_flower.drag_dx = null;
        _this.bee.drag_dx = null;
        _this.bee.distance = 0;
        if (mouse_dx) {
          return _this.bee.velocity.sub((new SAT.Vector()).copy(mouse_dx).scale(4));
        }
      });
      $(this.helper.canvas).on('mousemove', function(e) {
        if (!_this.is_dragging) {
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

    World.prototype.reset_game = function() {
      var background, option, poly, _i, _len, _ref;
      soundManager.stop('buzz');
      this.accumulator = 0;
      this.time = 0;
      _ref = this.background;
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
      var background, _i, _len, _ref;
      if (!this.bee.is_flying) {
        return;
      }
      _ref = this.background.backgrounds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        background = _ref[_i];
        background.x += (this.bee.last_position.x - this.bee.position.x) * background.increment;
        if (background.x < 0) {
          background.x += background.width;
        } else if (background.x + background.width > helper.width) {
          background.x -= background.width;
        }
      }
      if (this.bee.position.y > this.helper.height) {
        return this.reset_game();
      }
    };

    World.prototype.simulate = function(dt) {
      var collision_response, current_obstacle, offset,
        _this = this;
      this.bee.simulate(dt);
      if (!this.bee.is_flying) {
        return;
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
        soundManager.play("bounce" + (Math.floor(Math.random() * 3) + 1));
        soundManager.stop('buzz');
        if (this.bee.distance > 30) {
          this.bee.is_flying = false;
          offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse();
          this.bee.position.add(offset);
          this.bee.velocity = new SAT.Vector();
        } else {
          this.bee.distance = 0;
        }
      }
      current_obstacle = _.find(this.obstacles, function(obstacle) {
        return SAT.testPolygonPolygon(_this.bee.bounding_box, obstacle.poly, collision_response = new SAT.Response());
      });
      if (current_obstacle) {
        soundManager.play("bounce" + (Math.floor(Math.random() * 3) + 1));
        offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse();
        this.bee.position.add(offset);
        return this.bee.velocity.reflectN(collision_response.overlapN.perp()).scale(this.bounce_factor);
      }
    };

    World.prototype.render = function(helper, delta) {
      var dt;
      dt = 30;
      if (delta > 250) {
        delta = 250;
      }
      this.accumulator += delta;
      while (this.accumulator >= dt) {
        this.simulate(dt / 1000);
        this.accumulator -= dt;
        this.time += dt;
      }
      this.update(helper);
      this.background.render(helper);
      _.invoke(this.flowers, 'render', helper);
      _.invoke(this.obstacles, 'render', helper);
      return this.bee.render(helper);
    };

    return World;

  })();

}).call(this);
