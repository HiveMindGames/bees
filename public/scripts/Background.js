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
      if (this.x < 0) {
        this.x += this.width;
      }
      if (this.x >= this.width) {
        this.x -= this.width;
      }
      if (this.repeat) {
        this.pattern = helper.context.createPattern(this.image, 'repeat-x');
        helper.fill(this.pattern);
        return helper.rect(helper.half_width / helper.scale, helper.half_height / helper.scale, helper.width / helper.scale, helper.height / helper.scale);
      } else {
        helper.render_image(this.image, this.x - this.width, this.y, this.width, this.height);
        helper.render_image(this.image, this.x, this.y, this.width, this.height);
        return helper.render_image(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    };

    return Background;

  })();

}).call(this);
