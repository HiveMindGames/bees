(function() {

  window.Background = (function() {

    function Background(options) {
      this.options = options;
      _.each(this.options, function(option) {
        option.image = new Image(option.src);
        return option.image.src = option.src;
      });
    }

    Background.prototype.render_background = function(helper, background) {
      var height, image, scale, width, x, y;
      image = background.image, x = background.x, y = background.y, width = background.width, height = background.height;
      scale = helper.height / height;
      height = helper.height;
      width *= scale;
      helper.render_image(image, x - width, y, width, height);
      helper.render_image(image, x, y, width, height);
      return helper.render_image(image, x + width, y, width, height);
    };

    Background.prototype.render = function(helper) {
      var background, _i, _len, _ref, _results;
      _ref = this.options;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        background = _ref[_i];
        _results.push(this.render_background(helper, background));
      }
      return _results;
    };

    return Background;

  })();

}).call(this);
