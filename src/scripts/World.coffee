class window.World
  is_dragging: false
  bounce_factor: 0.9
  camera: new SAT.Vector()

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
      return unless @current_target

      init_mouse.x = mouse.x = e.clientX + @camera.x
      init_mouse.y = mouse.y = e.clientY + @camera.y
      @is_dragging = @current_target.contains(mouse)

      if @is_dragging
        @bee.thinking = null
        soundManager.play('stretch')

    $(@helper.canvas).on 'mouseup', (e) =>
      return unless @is_dragging

      soundManager.play("bounce#{Math.floor(Math.random() * 3) + 1}")
      soundManager.play('buzz', loops: 3)
      soundManager.stop('stretch')
      soundManager.play('spring')

      @is_dragging = false
      @bee.is_flying = true
      @current_target.drag_position = null
      @current_target.drag_dx = null
      @bee.drag_dx = null
      @bee.distance = 0
      @bee.velocity.sub((new SAT.Vector()).copy(mouse_dx).scale(4)) if mouse_dx

    $(@helper.canvas).on 'mousemove', (e) =>
      return unless @is_dragging

      mouse.x = e.clientX + @camera.x
      mouse.y = e.clientY + @camera.y
      mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse)
      @current_target.drag_position = mouse
      @current_target.drag_dx = mouse_dx
      @bee.drag_dx = mouse_dx

  reset_game: ->
    soundManager.stop('buzz')
    @accumulator = 0
    @time = 0

    for background in @background
      background.x = 0

    @bee = new Bee(@options.bee)
    @bee.thinking = 'hive'
    @targets = _.map @options.targets, (options) ->
      return new Flower(options)
    @current_target = @targets[0]
    @obstacles = (new Obstacle(poly) for poly in @options.obstacles)

  update: (helper) ->
    return unless @bee.is_flying

    for background in @background.backgrounds
      background.x += (@bee.last_position.x - @bee.position.x) * background.increment

      if background.x < 0
        background.x += background.width
      else if background.x + background.width > helper.width
        background.x -= background.width

    if @bee.position.y > @options.height
      @reset_game()

  simulate: (dt) ->
    @bee.simulate dt

    return unless @bee.is_flying

    collision_response = null

    old_current_target = @current_target

    @current_target = _.find @targets, (flower) =>
      if flower is @current_target
        return false

      has_collided = SAT.testPolygonPolygon(
        @bee.bounding_box,
        flower.bounding_box,
        collision_response = new SAT.Response()
      )
      return has_collided

    if @current_target
      soundManager.play("bounce#{Math.floor(Math.random() * 3) + 1}")
      soundManager.stop('buzz')

      unless @current_target.hit
        if @current_target.final
          @bee.points += 100
        else
          @bee.points += 50

      @current_target.hit = true

      if @current_target.final
        @bee.thinking = 'points'
        @bee.points += @bee.lives * 100
        soundManager.stop('background')
        soundManager.play('victory', {
          onfinish: =>
            soundManager.play('background')
            @reset_game()
        })
      else
        @bee.thinking = 'points'

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

      unless current_obstacle.hit
        @bee.points += 20

      current_obstacle.hit = true

  render: (helper, delta) ->
    dt = 30
    delta = 250 if delta > 250

    @accumulator += delta

    while @accumulator >= dt
      @simulate(dt / 1000)
      @accumulator -= dt
      @time += dt

    @update(helper)

    @position_camera()

    @background.render(helper)
    @helper.save()
    @helper.translate(-@camera.x, -@camera.y)
    _.invoke(@targets, 'render', helper)
    _.invoke(@obstacles, 'render', helper)
    @bee.render(helper)
    @helper.restore()

  position_camera: ->
    dest = (new SAT.Vector()).copy(@bee.position).sub(new SAT.Vector(@helper.width/2, @helper.height/2))

    dest.x = 0 if dest.x < 0
    dest.y = 0 if dest.y < 0
    dest.x = @options.width - @helper.width if dest.x + @helper.width > @options.width
    dest.y = @options.height - @helper.height if dest.y + @helper.height> @options.height

    @camera = dest
