(function() {
  var bee, helper, world;

  helper = new CanvasHelper(document.getElementById('game'));

  world = new World();

  bee = new Bee();

  helper.render(function() {
    world.render(helper);
    return bee.render(helper);
  });

}).call(this);
