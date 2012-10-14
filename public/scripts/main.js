(function() {
  var helper, world;

  helper = new CanvasHelper(document.getElementById('game'));

  world = new World(helper, {
    bee: {
      x: 264,
      y: helper.height - 290
    },
    backgrounds: [
      {
        src: 'images/bkg_0.png',
        width: 1698,
        height: 320,
        x: 0,
        y: 0,
        increment: 1
      }, {
        src: 'images/bkg_1.png',
        width: 1704,
        height: 320,
        x: 0,
        y: 0,
        increment: 2
      }, {
        src: 'images/bkg_2.png',
        width: 1707,
        height: 320,
        x: 0,
        y: 0,
        increment: 3
      }
    ],
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
    ],
    obstacles: [new SAT.Box(new SAT.Vector(10, 10), 30, 200).toPolygon(), new SAT.Box(new SAT.Vector(helper.half_width + 500, 10), 30, 200).toPolygon()]
  });

  helper.render(function() {
    return world.render(helper);
  });

}).call(this);
