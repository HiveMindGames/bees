class window.Flower
  stem_thickness: 10

  constructor: (@options={}) ->
    { @petal_width, @petal_height, @position, @stem_height, @angle } = @options
    @half_stem_height = @stem_height / 2
    @angle = Utils.degToRad(@angle)

  render: (helper) ->
    # stem
    helper.fill('#080')
    helper.save()
    helper.translate(@position.x, @position.y)
    helper.rotate(@angle)
    helper.rect(0, -@half_stem_height, @stem_thickness, @stem_height)

    helper.fill('#ee0')
    helper.translate(0, -@stem_height)
    helper.rect(0, 0, @petal_width, @petal_height)

    helper.restore()   
