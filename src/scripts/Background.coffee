class window.Background
  constructor: (@options) ->
    _.each @options, (option) ->
      option.image = new Image(option.src)
      option.image.src = option.src
 
  render_background: (helper, background) ->
    { image, x, y, width, height } = background
    scale = helper.height / height
    height = helper.height
    width *= scale
    helper.render_image(image, x - width, y, width, height)
    helper.render_image(image, x, y, width, height)
    helper.render_image(image, x + width, y, width, height)

  render: (helper) ->
    for background in @options
      @render_background(helper, background)
