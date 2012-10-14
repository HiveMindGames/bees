class window.World
  is_dragging: false
  is_zoomed: false
  zoom: 1
  max_zoom: 0.5
  zoom_factor: 0.025

  constructor: (@helper, @options) ->
    @background = new Background(@options.backgrounds)
    @reset_game()
    @translation = new SAT.Vector()

    mouse = new SAT.Vector()
    init_mouse = new SAT.Vector()
    mouse_dx = null

    $(@helper.canvas).on 'mousedown', (e) =>
      return unless @current_flower

      init_mouse.x = mouse.x = e.clientX
      init_mouse.y = mouse.y = e.clientY
      @is_dragging = not @is_zoomed and @current_flower.contains(mouse)

    $(@helper.canvas).on 'mouseup', (e) =>
      return unless @is_dragging

      soundManager.play("bounce#{Math.floor(Math.random() * 3) + 1}")
      soundManager.play('buzz', loops: 3)

      @is_dragging = false
      @is_zoomed = true
      @bee.is_flying = true
      @current_flower.drag_position = null
      @current_flower.drag_dx = null
      @bee.drag_dx = null
      @bee.acceleration.sub(mouse_dx) if mouse_dx

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

    for background in @options.backgrounds
      background.x = 0

    @bee = new Bee(@options.bee)
    @flowers = (new Flower(option) for option in @options.flowers)
    @current_flower = @flowers[0]
    @obstacles = (new Obstacle(poly) for poly in @options.obstacles)

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
      soundManager.play("bounce#{Math.floor(Math.random() * 3) + 1}")
      soundManager.stop('buzz')

      @bee.is_flying = false
      @is_zoomed = false
      offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse()
      @bee.position.add(offset)
      @bee.velocity.add(offset)

    current_obstacle = _.find @obstacles, (obstacle) =>
      return SAT.testPolygonPolygon(
        @bee.bounding_box,
        obstacle.poly,
        collision_response = new SAT.Response()
      )

    if current_obstacle
      soundManager.play("bounce#{Math.floor(Math.random() * 3) + 1}")
      @bee.velocity.reflectN(collision_response.overlapN.perp())

    if @bee.position.y > @helper.height
      @is_zoomed = false
      @reset_game()

  render: (helper) ->
    @update(helper)

    if @is_zoomed
      @zoom -= @zoom_factor
      @zoom = @max_zoom if @zoom < @max_zoom
    else
      @zoom += @zoom_factor
      @zoom = 1 if @zoom > 1

    @background.render(helper)
    _.invoke(@flowers, 'render', helper)
    _.invoke(@obstacles, 'render', helper)
    @bee.render(helper)
