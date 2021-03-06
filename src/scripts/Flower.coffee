class window.Flower
  precision: 10
  stem_thickness: 10

  constructor: (@options={}) ->
    { @final, @src, @width, @height, @position, @stem_height, @angle } = @options

    @image = new Image()
    @image.src = @src

    @half_stem_height = @stem_height / 2
    @angle = Utils.degToRad(@angle)

    @half_width = @width / 2
    @half_height = @height / 2

    @petal_position = Utils.rotateVector(new SAT.Vector(0, -@stem_height), @angle)
      .add(@position)
    @update_bounding_box()

  contains: (mouse) ->
    mousePos = new SAT.Vector(mouse.x - @mouse_box.pos.x, mouse.y -
      @mouse_box.pos.y)

    { points } = @mouse_box
    { length } = points

    pairs = ([point, points[(i+1)%length]] for point, i in points)

    return _.every pairs, (pair) ->
      edge = (new SAT.Vector()).copy(pair[1]).sub pair[0]
      to_mouse = (new SAT.Vector()).copy(pair[1]).sub mousePos

      # Cross product to find what side of the edge the mouse is on.
      return (edge.x * to_mouse.y - to_mouse.x * edge.y) < 0

  update_bounding_box: ->
    half_width = @half_width - @precision
    half_height = @half_height - @precision
    offset = 20
    @bounding_box = new SAT.Polygon(@petal_position, [
      Utils.rotateVector(new SAT.Vector(0, -half_height/2 - offset), @angle)
      Utils.rotateVector(new SAT.Vector(half_width, half_height - offset), @angle)
      Utils.rotateVector(new SAT.Vector(-half_width, half_height - offset), @angle)
    ])
    @mouse_box = new SAT.Polygon(@petal_position, [
      Utils.rotateVector(new SAT.Vector(-half_width, -half_height), @angle)
      Utils.rotateVector(new SAT.Vector(half_width, -half_height), @angle)
      Utils.rotateVector(new SAT.Vector(half_width, half_height), @angle)
      Utils.rotateVector(new SAT.Vector(-half_width, half_height), @angle)
    ])

  is_back_normal: (vec) ->
    normal = Utils.rotateVector(new SAT.Vector(0, 1), @angle)

    return (vec.x * normal.x + normal.y * vec.y) > 0

  render: (helper) ->
    # stem
    helper.save()
    stem_color = '#080'
    helper.context.lineCap = 'round'
    if @drag_position
      helper.context.beginPath()
      helper.context.moveTo(@position.x, @position.y)
      helper.context.quadraticCurveTo(@petal_position.x, @petal_position.y, @drag_position.x, @drag_position.y)
      helper.stroke_width(10)
      helper.stroke(stem_color)
      helper.context.stroke()
      helper.no_stroke()
    else
      helper.fill('#080')
      helper.translate(@position.x, @position.y)
      helper.rotate(@angle)
      helper.rect(0, -@half_stem_height, @stem_thickness, @stem_height)
    helper.restore()

    # petal
    helper.save()
    helper.translate(@drag_dx.x, @drag_dx.y) if @drag_dx
    helper.translate(@position.x, @position.y)
    helper.rotate(@angle)
    helper.translate(0, -@stem_height)
    helper.render_image(@image, -@half_width, -@half_height, @width, @height)
    helper.restore()

    # Draw Bounding box
    #helper.save()
    #helper.translate(@petal_position.x, @petal_position.y)
    #helper.polygon(@bounding_box.points)
    #helper.restore()
