(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.CanvasHelper = (function() {

    CanvasHelper.prototype.should_stroke = false;

    CanvasHelper.prototype.should_fill = true;

    CanvasHelper.prototype.ticks = 0;

    function CanvasHelper(canvas, width, height) {
      this.canvas = canvas != null ? canvas : document.createElement('canvas');
      this.width = width != null ? width : window.innerWidth;
      this.height = height != null ? height : window.innerHeight;
      this.step = __bind(this.step, this);

      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.context = this.canvas.getContext('2d');
      this.half_width = this.width / 2;
      this.half_height = this.height / 2;
    }

    CanvasHelper.prototype.no_stroke = function() {
      return this.should_stroke = false;
    };

    CanvasHelper.prototype.no_fill = function() {
      return this.should_fill = false;
    };

    CanvasHelper.prototype.stroke = function(color) {
      this.should_stroke = true;
      return this.context.strokeStyle = color;
    };

    CanvasHelper.prototype.fill = function(color) {
      this.should_fill = true;
      return this.context.fillStyle = color;
    };

    CanvasHelper.prototype.stroke_width = function(width) {
      return this.context.lineWidth = width;
    };

    CanvasHelper.prototype.translate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      return this.context.translate(x, y);
    };

    CanvasHelper.prototype.rotate = function(angle) {
      if (angle == null) {
        angle = 0;
      }
      return this.context.rotate(angle);
    };

    CanvasHelper.prototype.save = function() {
      return this.context.save();
    };

    CanvasHelper.prototype.restore = function() {
      return this.context.restore();
    };

    CanvasHelper.prototype.render_image = function(src, x, y, width, height) {
      var image,
        _this = this;
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (width == null) {
        width = this.width;
      }
      if (height == null) {
        height = this.height;
      }
      if (typeof src !== 'string') {
        this.context.drawImage(src, x, y, width, height);
        return;
      }
      image = new Image();
      image.onload = function() {
        return _this.context.drawImage(image, x, y, width, height);
      };
      return image.src = src;
    };

    CanvasHelper.prototype.text = function(value, x, y, font, lineHeight, textAlign, textBaseline) {
      var i, line, lines, _results;
      if (font == null) {
        font = '14px Helvetica, Arial, sans-serif';
      }
      if (lineHeight == null) {
        lineHeight = 18;
      }
      if (textAlign == null) {
        textAlign = 'left';
      }
      if (textBaseline == null) {
        textBaseline = 'top';
      }
      if (typeof value !== 'string') {
        value = value.toString();
      }
      this.context.font = font;
      this.context.textAlign = textAlign;
      this.context.textBaseline = textBaseline;
      lines = value.split('\n');
      _results = [];
      for (i in lines) {
        line = lines[i];
        _results.push(this.context.fillText(line, x, y + i * lineHeight));
      }
      return _results;
    };

    CanvasHelper.prototype.rect = function(x, y, width, height) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (width == null) {
        width = this.width;
      }
      if (height == null) {
        height = this.height;
      }
      if (this.should_fill) {
        this.context.fillRect(x, y, width, height);
      }
      if (this.should_stroke) {
        return this.context.strokeRect(x, y, width, height);
      }
    };

    CanvasHelper.prototype.clear = function(x, y, width, height) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this.width = width;
      this.height = height;
      return this.context.clearRect(x, y, this.width, this.height);
    };

    CanvasHelper.prototype.circle = function(x, y, radius) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (radius == null) {
        radius = 10;
      }
      this.context.beginPath();
      this.context.arc(x, y, radius, 0, Math.PI * 2, true);
      this.context.closePath();
      if (this.should_fill) {
        this.context.fill();
      }
      if (this.should_stroke) {
        return this.context.stroke();
      }
    };

    CanvasHelper.prototype.get_animation_frame = function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || function(callback, element) {
        return window.setTimeout(callback, 1000 / 60);
      };
    };

    CanvasHelper.prototype.step = function(timestamp) {
      this.clear();
      this.ticks++;
      this.render_callback.call(this);
      return this.get_animation_frame()(this.step, this.canvas);
    };

    CanvasHelper.prototype.render = function(render_callback) {
      this.render_callback = render_callback;
      return this.step();
    };

    return CanvasHelper;

  })();

}).call(this);