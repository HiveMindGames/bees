class window.Obstacle
  constructor: (@poly) ->
    @src = 'images/brick.png'
    @image = new Image()
    @image.src = @src
    @size = 70

  render: (helper) ->
    helper.save()
    helper.translate(@poly.pos.x, @poly.pos.y)
    helper.render_image(@image, 0, 0, @size, @size)
    helper.restore()
