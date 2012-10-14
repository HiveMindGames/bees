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
    { x, y } = mouse

    inside = false
    { points } = @bounding_box
    { length } = points
    max = length - 1
    i = 0

    while i < length
      xi = points[i].x
      yi = points[i].y
      xj = points[max].x
      yj = points[max].y
      console.warn xi, yi, xj, yj

      intersect = (yi > y isnt yj > y) and
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi)

      console.warn 'intersect', intersect
      inside = not inside if intersect
      max = i++

    console.warn 'inside', inside
    return inside

  update_bounding_box: ->
    @rotated_position = Utils.rotateVector(new SAT.Vector(0, -@stem_height), @angle)
    @bounding_box = new SAT.Polygon(new SAT.Vector(
      @position.x + @rotated_position.x
      @position.y + @rotated_position.y
    ), [
      Utils.rotateVector(new SAT.Vector(-@half_petal_width, -@half_petal_height), @angle)
      Utils.rotateVector(new SAT.Vector(@half_petal_width, -@half_petal_height), @angle)
      Utils.rotateVector(new SAT.Vector(-@half_petal_width, @half_petal_height), @angle)
      Utils.rotateVector(new SAT.Vector(@half_petal_width, @half_petal_height), @angle)
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
