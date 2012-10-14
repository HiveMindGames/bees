helper = new CanvasHelper(document.getElementById('game'))
world = new World()
bee = new Bee(new SAT.Vector(264, helper.half_height))

flower = new Flower({
  petal_width: 128,
  petal_height: 64,
  position: new SAT.Vector(helper.half_width, helper.height),
  stem_height: 240,
  angle: -25
})

collision_response = new SAT.Response()

init_mouse = new SAT.Vector()
mouse = new SAT.Vector()
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
    bee.acceleration.sub(mouse_dx)

$(helper.canvas).on 'mousemove', (e) ->
  unless is_dragging
    return

  mouse.x = e.clientX
  mouse.y = e.clientY
  mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse)

has_collided = false

update = ->
  if has_collided
    return

  has_collided = SAT.testPolygonPolygon(
    bee.bounding_box,
    flower.bounding_box,
    collision_response
  )

  if has_collided
    bee.is_flying = false
    offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse()
    bee.position.add(offset)
    bee.velocity.add(offset)
    console.warn has_collided, collision_response

helper.render ->
  update()

  world.render(helper)
  flower.render(helper)
  bee.render(helper)
