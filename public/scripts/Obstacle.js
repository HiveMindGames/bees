(function() {

  window.Obstacle = (function() {

    function Obstacle(poly) {
      this.poly = poly;
      this.src = 'images/brick.png';
      this.image = new Image();
      this.image.src = this.src;
      this.size = 70;
    }

    Obstacle.prototype.render = function(helper) {
      helper.save();
      helper.translate(this.poly.pos.x, this.poly.pos.y);
      helper.render_image(this.image, 0, 0, this.size, this.size);
      return helper.restore();
    };

    return Obstacle;

  })();

}).call(this);
