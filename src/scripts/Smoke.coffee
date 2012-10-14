class window.Smoke
  constructor: (@position) ->
    @points = 20
    @src = 'images/darkcloud.png'
    @width = 100
    @height = 90
    @half_width = @width / 2
    @half_height = @height / 2

    @image = new Image()
    @image.src = @src

    @offset = 0

  render: (helper) ->
    helper.save()
    helper.translate(@position.x, @position.y - @offset++)
    helper.rotate(helper.ticks * 0.1)
    helper.translate(-@half_width, -@half_height)
    helper.render_image(@image, 0, 0, @width, @height)
    helper.restore()
