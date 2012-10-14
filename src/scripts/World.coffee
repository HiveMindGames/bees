class window.World
  is_dragging: false
  bounce_factor: 0.9

  constructor: (@helper, @options) ->
    @background = new CompositeBackground(@options.backgrounds)
    @reset_game()
    @translation = new SAT.Vector()

    mouse = new SAT.Vector()
    init_mouse = new SAT.Vector()
    mouse_dx = null

    $('#replay').on 'click', (e) =>
      e.preventDefault()
      @reset_game()

    $(@helper.canvas).on 'mousedown', (e) =>
      return unless @current_flower

      init_mouse.x = mouse.x = e.clientX
      init_mouse.y = mouse.y = e.clientY
      @is_dragging = @current_flower.contains(mouse)
      if @is_dragging
        @bee.position.x = @current_flower.bounding_box.pos.x
        @bee.position.y = @current_flower.bounding_box.pos.y - @current_flower.half_petal_height
        soundManager.play('stretch')

    $(@helper.canvas).on 'mouseup', (e) =>
      return unless @is_dragging

      soundManager.play("bounce#{Math.floor(Math.random() * 3) + 1}")
      soundManager.play('buzz', loops: 3)
      soundManager.stop('stretch')
      soundManager.play('spring')

      @is_dragging = false
      @bee.is_flying = true
      @current_flower.drag_position = null
      @current_flower.drag_dx = null
      @bee.drag_dx = null
      @bee.distance = 0
      @bee.velocity.sub((new SAT.Vector()).copy(mouse_dx).scale(4)) if mouse_dx

    $(@helper.canvas).on 'mousemove', (e) =>
      return unless @is_dragging

      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse)
      @current_flower.drag_position = mouse
      @current_flower.drag_dx = mouse_dx
      @bee.drag_dx = mouse_dx

  reset_game: ->
    soundManager.stop('buzz')
    @accumulator = 0
    @time = 0

    for background in @background
      background.x = 0

    @bee = new Bee(@options.bee)
    @flowers = (new Flower(option) for option in @options.flowers)
    @current_flower = @flowers[0]
    @obstacles = (new Obstacle(poly) for poly in @options.obstacles)

  update: (helper) ->
    return unless @bee.is_flying

    for background in @background.backgrounds
      background.x += (@bee.last_position.x - @bee.position.x) * background.increment

      if background.x < 0
        background.x += background.width
      else if background.x + background.width > helper.width
        background.x -= background.width

    if @bee.position.y > @helper.height
      @reset_game()

  simulate: (dt) ->
    @bee.simulate dt

    return unless @bee.is_flying

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
      soundManager.play("bounce#{Math.floor(Math.random() * 3) + 1}")
      soundManager.stop('buzz')

      if @bee.distance > 30
        @bee.is_flying = false
        offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse()
        @bee.position.add(offset)
        @bee.velocity = new SAT.Vector()
      else
        @bee.distance = 0

    current_obstacle = _.find @obstacles, (obstacle) =>
      return SAT.testPolygonPolygon(
        @bee.bounding_box,
        obstacle.poly,
        collision_response = new SAT.Response()
      )

    if current_obstacle
      soundManager.play("bounce#{Math.floor(Math.random() * 3) + 1}")
      offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse()
      @bee.position.add(offset)
      @bee.velocity.reflectN(collision_response.overlapN.perp()).scale(@bounce_factor)



  render: (helper, delta) ->
    dt = 30
    delta = 250 if delta > 250

    @accumulator += delta

    while @accumulator >= dt
      @simulate(dt / 1000)
      @accumulator -= dt
      @time += dt

    @update(helper)

    @background.render(helper)
    _.invoke(@flowers, 'render', helper)
    _.invoke(@obstacles, 'render', helper)
    @bee.render(helper)
