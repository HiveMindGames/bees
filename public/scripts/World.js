(function() {

  window.World = (function() {

    World.prototype.is_dragging = false;

    World.prototype.bounce_factor = 0.9;

    World.prototype.camera = new SAT.Vector();

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
        if (!_this.current_target) {
          return;
        }
        init_mouse.x = mouse.x = e.clientX + _this.camera.x;
        init_mouse.y = mouse.y = e.clientY + _this.camera.y;
        _this.is_dragging = _this.current_target.contains(mouse);
        if (_this.is_dragging) {
          _this.bee.thinking = null;
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
        _this.current_target.drag_position = null;
        _this.current_target.drag_dx = null;
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
        mouse.x = e.clientX + _this.camera.x;
        mouse.y = e.clientY + _this.camera.y;
        mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse);
        _this.current_target.drag_position = mouse;
        _this.current_target.drag_dx = mouse_dx;
        return _this.bee.drag_dx = mouse_dx;
      });
      $(this.helper.canvas).on('mouseleave', function(e) {
        _this.is_dragging = false;
        _this.current_target.drag_position = null;
        _this.current_target.drag_dx = null;
        _this.bee.drag_dx = null;
        return _this.bee.distance = 0;
      });
    }

    World.prototype.reset_game = function() {
      var background, new_bee, poly, _i, _len, _ref;
      soundManager.stop('buzz');
      this.accumulator = 0;
      this.time = 0;
      _ref = this.background;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        background = _ref[_i];
        background.x = 0;
      }
      new_bee = new Bee(this.options.bee);
      if (this.bee && this.bee.lives > 1) {
        new_bee.lives = --this.bee.lives;
      }
      this.bee = new_bee;
      soundManager.play('thoughtbubble');
      this.targets = _.map(this.options.targets, function(options) {
        return new Flower(options);
      });
      this.current_target = this.targets[0];
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
      if (this.bee.position.y > this.options.height) {
        return this.reset_game();
      }
    };

    World.prototype.simulate = function(dt) {
      var collision_response, current_obstacle, offset, old_current_target,
        _this = this;
      this.bee.simulate(dt);
      if (!this.bee.is_flying) {
        return;
      }
      collision_response = null;
      old_current_target = this.current_target;
      this.current_target = _.find(this.targets, function(flower) {
        var has_collided;
        if (flower === _this.current_target) {
          return false;
        }
        has_collided = SAT.testPolygonPolygon(_this.bee.bounding_box, flower.bounding_box, collision_response = new SAT.Response());
        return has_collided;
      });
      if (this.current_target) {
        soundManager.play("bounce" + (Math.floor(Math.random() * 3) + 1));
        soundManager.stop('buzz');
        if (!this.current_target.hit) {
          if (this.current_target.final) {
            this.bee.points += 100;
            this.bee.points += this.bee.lives * 100;
          } else {
            this.bee.points += 50;
          }
        }
        this.current_target.hit = true;
        this.bee.thinking = 'points';
        soundManager.play('thoughtbubble');
        if (this.current_target.final) {
          this.current_target = null;
          soundManager.stop('background');
          soundManager.play('victory', {
            onfinish: function() {
              soundManager.play('background');
              return _this.reset_game();
            }
          });
          this.bee.is_flying = false;
          return;
        }
        if (this.bee.distance > 30) {
          offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse();
          if (this.current_target.is_back_normal(offset)) {
            this.bee.position.add(offset);
            this.bee.velocity.reflectN(collision_response.overlapN.perp()).scale(this.bounce_factor);
          } else {
            this.bee.is_flying = false;
            this.bee.position.add(offset);
            this.bee.velocity = new SAT.Vector();
          }
        } else {
          this.bee.distance = 0;
        }
      }
      current_obstacle = _.find(this.obstacles, function(obstacle) {
        return SAT.testPolygonPolygon(_this.bee.bounding_box, obstacle.poly, collision_response = new SAT.Response());
      });
      if (current_obstacle) {
        soundManager.play('collision');
        offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse();
        this.collision = new Collision((new SAT.Vector()).copy(this.bee.position));
        setTimeout(function() {
          return _this.collision = null;
        }, 500);
        this.bee.position.add(offset);
        this.bee.velocity.reflectN(collision_response.overlapN.perp()).scale(this.bounce_factor);
        if (!current_obstacle.hit) {
          this.bee.points += 20;
        }
        return current_obstacle.hit = true;
      }
    };

    World.prototype.render = function(helper, delta) {
      var dt, font;
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
      this.position_camera();
      this.background.render(helper);
      this.helper.save();
      this.helper.translate(-this.camera.x, -this.camera.y);
      _.invoke(this.targets, 'render', helper);
      _.invoke(this.obstacles, 'render', helper);
      this.bee.render(helper);
      if (this.collision) {
        this.collision.render(helper);
      }
      this.helper.restore();
      helper.fill('#00a');
      helper.text("points: " + this.bee.points, 32, helper.height - 64, font = '28px "Sniglet", cursive', null, 'left', 'middle');
      return helper.text("lives: " + this.bee.lives, 32, helper.height - 32, font = '28px "Sniglet", cursive', null, 'left', 'middle');
    };

    World.prototype.position_camera = function() {
      var dest;
      dest = (new SAT.Vector()).copy(this.bee.position).sub(new SAT.Vector(this.helper.width / 2, this.helper.height / 2));
      if (dest.x < 0) {
        dest.x = 0;
      }
      if (dest.y < 0) {
        dest.y = 0;
      }
      if (dest.x + this.helper.width > this.options.width) {
        dest.x = this.options.width - this.helper.width;
      }
      if (dest.y + this.helper.height > this.options.height) {
        dest.y = this.options.height - this.helper.height;
      }
      return this.camera = dest;
    };

    return World;

  })();

}).call(this);
