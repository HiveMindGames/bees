class window.CompositeBackground
  constructor: (@options) ->
    @backgrounds = _.map @options, (options) ->
      return new Background(options)
 
  render: (helper, zoom) ->
    _.invoke(@backgrounds, 'render', helper)
