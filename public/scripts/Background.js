(function() {

  window.Background = (function() {

    function Background(options) {
      this.options = options;
      _.each(this.options, function(option) {
        option.image = new Image(option.src);
        return option.image.src = option.src;
      });
    }

    Background.prototype.render = function(helper) {
      var background, _i, _len, _ref, _results;
      _ref = this.options;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        background = _ref[_i];
        _results.push(helper.render_image(background.image, background.x, background.y, background.width, background.height));
      }
      return _results;
    };

    return Background;

  })();

}).call(this);
