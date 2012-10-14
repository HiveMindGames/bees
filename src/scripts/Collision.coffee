class window.Collision
  constructor: (@options) ->
    @src = 'images/cloud.png'
    @width = 140
    @height = 130
    @half_width = @width / 2
    @half_height = @height / 2

    @image = new Image()
    @image.src = @src

    @position = new SAT.Vector(x, y)

  render: (helper) ->
    helper.save()
    helper.translate(@position.x, @position.y)
    helper.translate(-@half_width, -@half_height)
    helper.render_image(@image, 0, 0, @width, @height)
    helper.restore()
