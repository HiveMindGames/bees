helper = new CanvasHelper(document.getElementById('game'))
world = new World()
bee = new Bee()

helper.render ->
  world.render(helper)
  bee.render(helper)
