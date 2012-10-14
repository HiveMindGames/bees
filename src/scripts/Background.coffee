class window.Background
  constructor: (@options) ->
    { @src, @repeat, @image, @x, @y, @width, @height, @increment } = @options

    @image = new Image(@src)
    @image.src = @src

  render: (helper) ->
    @y = helper.height - @height

    if @repeat
      @pattern = helper.context.createPattern(@image, 'repeat-x')
      helper.fill(@pattern)
      helper.rect(helper.half_width, helper.half_height)
    else
      helper.render_image(@image, @x - @width, @y, @width, @height)
      helper.render_image(@image, @x, @y, @width, @height)
      helper.render_image(@image, @x + @width, @y, @width, @height)
