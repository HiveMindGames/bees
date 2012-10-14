(function() {

  window.Background = (function() {

    function Background(options) {
      var _ref;
      this.options = options;
      _ref = this.options, this.src = _ref.src, this.repeat = _ref.repeat, this.image = _ref.image, this.x = _ref.x, this.y = _ref.y, this.width = _ref.width, this.height = _ref.height, this.increment = _ref.increment;
      this.image = new Image(this.src);
      this.image.src = this.src;
    }

    Background.prototype.render = function(helper) {
      this.y = helper.height - this.height;
      if (this.repeat) {
        this.pattern = helper.context.createPattern(this.image, 'repeat-x');
        helper.fill(this.pattern);
        return helper.rect(helper.half_width, helper.half_height);
      } else {
        helper.render_image(this.image, this.x - this.width, this.y, this.width, this.height);
        helper.render_image(this.image, this.x, this.y, this.width, this.height);
        return helper.render_image(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    };

    return Background;

  })();

}).call(this);
