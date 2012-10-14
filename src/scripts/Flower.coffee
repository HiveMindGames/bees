class window.Flower
  stem_thickness: 10

  constructor: (@options={}) ->
    { @petal_width, @petal_height, @position, @stem_height, @angle } = @options
    @half_stem_height = @stem_height / 2
    @angle = Utils.degToRad(@angle)

    @half_petal_width = @petal_width / 2
    @half_petal_height = @petal_height / 2

    @update_bounding_box()

  contains: (mouse) ->
    mousePos = new SAT.Vector(mouse.x - @bounding_box.pos.x, mouse.y -
      @bounding_box.pos.y)

    { points } = @bounding_box
    { length } = points

    pairs = ([point, points[(i+1)%length]] for point, i in points)

    return _.every pairs, (pair) ->
      edge = (new SAT.Vector()).copy(pair[1]).sub pair[0]
      to_mouse = (new SAT.Vector()).copy(pair[1]).sub mousePos

      # Cross product to find what side of the edge the mouse is on.
      return (edge.x * to_mouse.y - to_mouse.x * edge.y) < 0

  update_bounding_box: ->
    @rotated_position = Utils.rotateVector(new SAT.Vector(0, -@stem_height), @angle)
    @bounding_box = new SAT.Polygon(new SAT.Vector(
      @position.x + @rotated_position.x
      @position.y + @rotated_position.y
    ), [
      Utils.rotateVector(new SAT.Vector(-@half_petal_width, -@half_petal_height), @angle)
      Utils.rotateVector(new SAT.Vector(@half_petal_width, -@half_petal_height), @angle)
      Utils.rotateVector(new SAT.Vector(@half_petal_width, @half_petal_height), @angle)
      Utils.rotateVector(new SAT.Vector(-@half_petal_width, @half_petal_height), @angle)
    ])
    @bounding_box.recalc()

  render: (helper) ->
    # stem
    helper.fill('#080')
    helper.save()
    helper.translate(@position.x, @position.y)
    helper.rotate(@angle)
    helper.rect(0, -@half_stem_height, @stem_thickness, @stem_height)

    # petal
    helper.fill('#ee0')
    helper.translate(0, -@stem_height)
    helper.rect(0, 0, @petal_width, @petal_height)

    helper.restore()   
