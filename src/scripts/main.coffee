helper = new CanvasHelper(document.getElementById('game'))
world = new World()
bee = new Bee()
flower = new Flower({
  petal_width: 128,
  petal_height: 64,
  position: new Vector(helper.width - 400, helper.height),
  stem_height: 240,
  angle: -25
})

bee.position.x = bee.size + 200
bee.position.y = helper.half_height

init_mouse = new Vector()
mouse = new Vector()
is_dragging = false
mouse_dx = null

$(helper.canvas).on 'mousedown', (e) ->
  init_mouse.x = mouse.x = e.clientX
  init_mouse.y = mouse.y = e.clientY
  is_dragging = bee.contains(mouse)

$(helper.canvas).on 'mouseup', (e) ->
  if is_dragging
    is_dragging = false
    bee.is_flying = true
    bee.acceleration.subtract(mouse_dx)

$(helper.canvas).on 'mousemove', (e) ->
  unless is_dragging
    return

  mouse.x = e.clientX
  mouse.y = e.clientY
  mouse_dx = Vector.subtract(mouse, init_mouse)

helper.render ->
  world.render(helper)
  flower.render(helper)
  bee.render(helper)
