class window.Background
  constructor: (@options) ->
    _.each @options, (option) ->
      option.image = new Image(option.src)
      option.image.src = option.src
 
  render: (helper) ->
    for background in @options
      helper.render_image(background.image, background.x, background.y, background.width, background.height) 
