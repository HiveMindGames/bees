(function() {

  window.CompositeBackground = (function() {

    function CompositeBackground(options) {
      this.options = options;
      this.backgrounds = _.map(this.options, function(options) {
        return new Background(options);
      });
    }

    CompositeBackground.prototype.render = function(helper, zoom) {
      return _.invoke(this.backgrounds, 'render', helper);
    };

    return CompositeBackground;

  })();

}).call(this);
