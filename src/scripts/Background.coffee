class window.Background
  constructor: (@options) ->
    { @src, @repeat, @image, @x, @y, @width, @height, @increment } = @options

    @image = new Image(@src)
    @image.src = @src

  render: (helper) ->
    @x += @width if @x < 0
    @x -= @width if @x >= @width

    if @repeat
      @pattern = helper.context.createPattern(@image, 'repeat-x')
      helper.fill(@pattern)
      helper.rect(helper.half_width / helper.scale, helper.half_height /
        helper.scale, helper.width / helper.scale, helper.height / helper.scale)
    else
      helper.render_image(@image, @x - @width, @y, @width, @height)
      helper.render_image(@image, @x, @y, @width, @height)
      helper.render_image(@image, @x + @width, @y, @width, @height)
      helper.render_image(@image, @x + (2 * @width), @y, @width, @height)
