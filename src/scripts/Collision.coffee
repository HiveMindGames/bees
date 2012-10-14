class window.Collision
  constructor: (@position) ->
    @points = 20
    @src = 'images/cloud.png'
    @width = 100
    @height = 90
    @half_width = @width / 2
    @half_height = @height / 2

    @image = new Image()
    @image.src = @src

  render: (helper) ->
    helper.save()
    helper.translate(@position.x, @position.y)
    helper.translate(-@half_width, -@half_height)
    helper.render_image(@image, 0, 0, @width, @height)

    helper.fill('rgb(145, 126, 52)')
    helper.text("+#{@points}", 50, 45, font='28px "Sniglet", cursive', null, 'center', 'middle')

    helper.restore()
