class window.Flower
  stem_thickness: 10

  constructor: (@options={}) ->
    { @petal_width, @petal_height, @position, @stem_height, @angle } = @options
    @half_stem_height = @stem_height / 2
    @angle = Utils.degToRad(@angle)

    @half_petal_width = @petal_width / 2
    @half_petal_height = @petal_height / 2

    @update_bounding_box()

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
