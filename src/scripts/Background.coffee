class window.Background
  constructor: (@options) ->
    { @src, @repeat, @image, @x, @y, @width, @height, @increment } = @options

    @image = new Image(@src)
    @image.src = @src

  render: (helper) ->
    @width = Math.floor(@width)
    @height = Math.floor(@height)
    @x = Math.floor(@x)
    @y = Math.floor(helper.height - @height)

    # @pattern = helper.context.createPattern(@image, 'repeat-x')
    # helper.fill(@pattern)
    # helper.rect(@x, @y, @width, @height)

    helper.render_image(@image, @x - @width, @y, @width, @height)
    helper.render_image(@image, @x, @y, @width, @height)
    helper.render_image(@image, @x + @width, @y, @width, @height)
