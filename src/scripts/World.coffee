class window.World
  constructor: (@helper, @options) ->
    @background = new Background(@options.backgrounds)
    @bee = new Bee(@options.bee)
    @flowers = (new Flower(option) for option in @options.flowers)
    @current_flower = @flowers[0]

    init_mouse = new SAT.Vector()
    mouse = new SAT.Vector()
    is_dragging = false
    mouse_dx = null

    $(window).on 'keydown', (e) =>
      console.log "keydown", e
      unless e.keyCode is 39
        return

      for background in @options.backgrounds
        if (background.x + background.increment) < (background.width - background.increment)
          background.x += background.increment
        else
          background.x = 0

    $(@helper.canvas).on 'mousedown', (e) =>
      init_mouse.x = mouse.x = e.clientX
      init_mouse.y = mouse.y = e.clientY
      is_dragging = @bee.contains(mouse)

    $(@helper.canvas).on 'mouseup', (e) =>
      if is_dragging
        is_dragging = false
        @bee.is_flying = true
        @bee.acceleration.sub(mouse_dx)

    $(@helper.canvas).on 'mousemove', (e) =>
      unless is_dragging
        return

      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse)

  update: ->
    unless @bee.is_flying
      return

    collision_response = null

    @current_flower = _.find @flowers, (flower) =>
      if flower is @current_flower
        return false

      return SAT.testPolygonPolygon(
        @bee.bounding_box,
        flower.bounding_box,
        collision_response = new SAT.Response()
      )

    if @current_flower
      @bee.is_flying = false
      offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse()
      @bee.position.add(offset)
      @bee.velocity.add(offset)

  render: (helper) ->
    _.invoke(@flowers, 'render', helper)
    @bee.render(helper)
    @background.render(helper)
    @update()
