(function() {

  window.Smoke = (function() {

    function Smoke(position) {
      this.position = position;
      this.points = 20;
      this.src = 'images/darkcloud.png';
      this.width = 100;
      this.height = 90;
      this.half_width = this.width / 2;
      this.half_height = this.height / 2;
      this.image = new Image();
      this.image.src = this.src;
      this.offset = 0;
    }

    Smoke.prototype.render = function(helper) {
      helper.save();
      helper.translate(this.position.x, this.position.y - this.offset++);
      helper.rotate(helper.ticks * 0.1);
      helper.translate(-this.half_width, -this.half_height);
      helper.render_image(this.image, 0, 0, this.width, this.height);
      return helper.restore();
    };

    return Smoke;

  })();

}).call(this);
