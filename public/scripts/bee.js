(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Bee = (function(_super) {

    __extends(Bee, _super);

    function Bee() {
      Bee.__super__.constructor.apply(this, arguments);
    }

    Bee.prototype.update = function() {};

    Bee.prototype.render = function() {};

    return Bee;

  })(Physical);

}).call(this);
