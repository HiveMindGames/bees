(function() {

  window.Flower = (function() {

    Flower.prototype.stem_thickness = 10;

    function Flower(options) {
      var _ref;
      this.options = options != null ? options : {};
      _ref = this.options, this.petal_width = _ref.petal_width, this.petal_height = _ref.petal_height, this.position = _ref.position, this.stem_height = _ref.stem_height, this.angle = _ref.angle;
      this.half_stem_height = this.stem_height / 2;
      this.angle = Utils.degToRad(this.angle);
    }

    Flower.prototype.render = function(helper) {
      helper.fill('#080');
      helper.save();
      helper.translate(this.position.x, this.position.y);
      helper.rotate(this.angle);
      helper.rect(0, -this.half_stem_height, this.stem_thickness, this.stem_height);
      helper.fill('#ee0');
      helper.translate(0, -this.stem_height);
      helper.rect(0, 0, this.petal_width, this.petal_height);
      return helper.restore();
    };

    return Flower;

  })();

}).call(this);
