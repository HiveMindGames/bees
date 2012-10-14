(function() {

  window.Obstacle = (function() {

    function Obstacle(poly) {
      this.poly = poly;
      return this;
    }

    Obstacle.prototype.render = function(helper) {
      helper.save();
      helper.fill('#00A');
      helper.translate(this.poly.pos.x, this.poly.pos.y);
      helper.polygon(this.poly.points);
      return helper.restore();
    };

    return Obstacle;

  })();

}).call(this);
