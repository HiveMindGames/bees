(function() {

  window.Collision = (function() {

    function Collision(position) {
      this.position = position;
      this.points = 20;
      this.src = 'images/cloud.png';
      this.width = 100;
      this.height = 90;
      this.half_width = this.width / 2;
      this.half_height = this.height / 2;
      this.image = new Image();
      this.image.src = this.src;
    }

    Collision.prototype.render = function(helper) {
      var font;
      helper.save();
      helper.translate(this.position.x, this.position.y);
      helper.translate(-this.half_width, -this.half_height);
      helper.render_image(this.image, 0, 0, this.width, this.height);
      helper.fill('rgb(145, 126, 52)');
      helper.text("+" + this.points, 50, 45, font = '28px "Sniglet", cursive', null, 'center', 'middle');
      return helper.restore();
    };

    return Collision;

  })();

}).call(this);
