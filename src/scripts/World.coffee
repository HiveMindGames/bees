class window.World
  constructor: (@helper, @options) ->
    @background = new Background(@options.backgrounds)
    @new_game()

    mouse = new SAT.Vector()
    init_mouse = new SAT.Vector()
    is_dragging = false
    mouse_dx = null

    $(@helper.canvas).on 'mousedown', (e) =>
      return unless @current_flower

      init_mouse.x = mouse.x = e.clientX
      init_mouse.y = mouse.y = e.clientY
      is_dragging = @current_flower.contains(mouse)

    $(@helper.canvas).on 'mouseup', (e) =>
      return unless is_dragging

      is_dragging = false
      @bee.is_flying = true
      @current_flower.drag_position = null
      @current_flower.drag_dx = null
      @bee.drag_dx = null
      @bee.acceleration.sub(mouse_dx) if mouse_dx

    $(@helper.canvas).on 'mousemove', (e) =>
      return unless is_dragging

      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse)
      @current_flower.drag_position = mouse
      @current_flower.drag_dx = mouse_dx
      @bee.drag_dx = mouse_dx

  new_game: ->
    for background in @options.backgrounds
      background.x = 0

    @bee = new Bee(@options.bee)
    @flowers = (new Flower(option) for option in @options.flowers)
    @current_flower = @flowers[0]

  update: (helper) ->
    return unless @bee.is_flying

    for background in @options.backgrounds
      background.x += (@bee.last_position.x - @bee.position.x) * background.increment
      if background.x + background.width < helper.width
        background.x += background.width
      if background.x > 0
        background.x -= background.width

    collision_response = null

    @current_flower = _.find @flowers, (flower) =>
      if flower is @current_flower
        return false

      has_collided = SAT.testPolygonPolygon(
        @bee.bounding_box,
        flower.bounding_box,
        collision_response = new SAT.Response()
      )
      return has_collided

    if @current_flower
      @bee.is_flying = false
      offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse()
      @bee.position.add(offset)
      @bee.velocity.add(offset)

    if @bee.position.y > @helper.height
      @new_game()

  render: (helper) ->
    @update(helper)

    @background.render(helper)
    _.invoke(@flowers, 'render', helper)
    @bee.render(helper)
