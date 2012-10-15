class window.World
  is_dragging: false
  bounce_factor: 0.9
  camera: new SAT.Vector()

  constructor: (@helper, @options) ->
    @helper.viewWidth = @options.viewWidth
    @helper.viewHeight = @options.viewHeight
    @helper.resize()

    @background = new CompositeBackground(@options.backgrounds)
    @reset_game()
    @translation = new SAT.Vector()

    init_mouse = new SAT.Vector()
    mouse_dx = null

    $('#replay').on 'click', (e) =>
      e.preventDefault()
      @reset_game()

    $(@helper.canvas).on 'mousedown touchstart', (e) =>
      e.preventDefault()
      return unless @current_target

      mouse = if e.type == 'touchstart'
        new SAT.Vector(e.touches[0].clientX, e.touches[0].clientY)
      else
        new SAT.Vector(e.clientX, e.clientY)

      mouse.scale 1/@helper.scale
      mouse.add(@camera)

      init_mouse = new SAT.Vector().copy(mouse)

      @is_dragging = @current_target.contains(mouse)

      if @is_dragging
        @bee.thinking = null
        soundManager.play('stretch')

    $(@helper.canvas).on 'mouseup touchend', (e) =>
      e.preventDefault()
      return unless @is_dragging

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

    $(@helper.canvas).on 'mousemove touchmove', (e) =>
      e.preventDefault()
      return unless @is_dragging

      mouse = if e.type == 'touchmove'
        new SAT.Vector(e.touches[0].clientX, e.touches[0].clientY)
      else
        new SAT.Vector(e.clientX, e.clientY)

      mouse.scale 1/@helper.scale
      mouse.add(@camera)

      mouse_dx = new SAT.Vector().copy(mouse).sub(init_mouse)
      @current_target.drag_position = mouse
      @current_target.drag_dx = mouse_dx
      @bee.drag_dx = mouse_dx

    $(@helper.canvas).on 'mouseleave', (e) =>
      @is_dragging = false
      if @current_target
        @current_target.drag_position = null
        @current_target.drag_dx = null
      @bee.drag_dx = null
      @bee.distance = 0


    $(window).on 'resize', (e) =>
      height = Math.max(300, window.innerHeight)
      @helper.resize window.innerWidth, height

  reset_game: ->
    soundManager.stop('buzz')
    @accumulator = 0
    @time = 0

    for background in @background
      background.x = 0

    new_bee = new Bee(@options.bee)

    if @bee and @bee.lives > 1
      new_bee.lives = --@bee.lives

    @bee = new_bee

    soundManager.play('thoughtbubble')
    @targets = _.map @options.targets, (options) ->
      return new Flower(options)
    @current_target = @targets[0]
    @obstacles = (new Obstacle(poly) for poly in @options.obstacles)

  update: (helper) ->
    return unless @bee.is_flying

    for background in @background.backgrounds
      background.x = -@camera.x * (background.increment / 10)

    if @bee.position.y > @options.height
      soundManager.play('collision')
      @smoke = new Smoke((new SAT.Vector()).copy(@bee.position))
      setTimeout =>
        @smoke = null
      , 1000
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
      soundManager.play('landing')
      soundManager.stop('buzz')

      unless @current_target.hit
        if @current_target.final
          @bee.points += 100
          @bee.points += @bee.lives * 100
        else
          @bee.points += 50

      @current_target.hit = true
      @bee.thinking = 'points'
      soundManager.play('thoughtbubble')

      if @current_target.final
        @current_target = null
        soundManager.stop('background')
        soundManager.play('victory', {
          onfinish: =>
            soundManager.play('background')
            @reset_game()
        })
        @bee.is_flying = false
        return

      if @bee.distance > 30
        offset = (new SAT.Vector()).copy(collision_response.overlapV).reverse()
        if @current_target.is_back_normal(offset)
          @bee.position.add(offset)
          @bee.velocity.reflectN(collision_response.overlapN.perp()).scale(@bounce_factor)
        else
          @bee.is_flying = false
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
        @collision = new Collision((new SAT.Vector()).copy(@bee.position))
        setTimeout =>
          @collision = null
        , 500

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

    @position_camera(helper)

    @background.render(helper)
    @helper.save()
    @helper.translate(-@camera.x, -@camera.y)
    _.invoke(@targets, 'render', helper)
    _.invoke(@obstacles, 'render', helper)
    @bee.render(helper)
    @collision.render(helper) if @collision
    @smoke.render(helper) if @smoke
    @helper.restore()

    helper.fill('rgb(144, 124, 58)')
    helper.text("points: #{@bee.points}", 32, @options.height - 60, font='28px "Sniglet", cursive', null, 'left', 'middle')
    helper.text("lives: #{@bee.lives}", 32, @options.height - 28, font='28px "Sniglet", cursive', null, 'left', 'middle')
    helper.fill('white')
    helper.text("points: #{@bee.points}", 32, @options.height - 64, font='28px "Sniglet", cursive', null, 'left', 'middle')
    helper.text("lives: #{@bee.lives}", 32, @options.height - 32, font='28px "Sniglet", cursive', null, 'left', 'middle')

  position_camera: (helper) ->
    view = (new SAT.Vector(helper.width, helper.height)).scale(1/helper.scale)
    dest = (new SAT.Vector()).copy(@bee.position).sub((new SAT.Vector()).copy(view).scale(1/2))


    dest.x = 0 if dest.x < 0
    dest.y = 0 if dest.y < 0
    dest.x = @options.width - view.x if dest.x + view.x > @options.width
    dest.y = @options.height - view.y if dest.y + view.y> @options.height

    @camera = dest
