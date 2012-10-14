(function() {
  var helper, world;

  helper = new CanvasHelper(document.getElementById('game'));

  world = new World(helper, {
    bee: {
      x: 264,
      y: helper.height - 290
    },
    flowers: [
      {
        petal_width: 128,
        petal_height: 64,
        position: new SAT.Vector(200, helper.height),
        stem_height: 240,
        angle: 15
      }, {
        petal_width: 128,
        petal_height: 64,
        position: new SAT.Vector(helper.half_width - 200, helper.height),
        stem_height: 240,
        angle: 5
      }, {
        petal_width: 128,
        petal_height: 64,
        position: new SAT.Vector(helper.half_width + 350, helper.height),
        stem_height: 240,
        angle: -25
      }
    ]
  });

  helper.render(function() {
    return world.render(helper);
  });

}).call(this);
