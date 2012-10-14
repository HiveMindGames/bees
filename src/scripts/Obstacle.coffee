class window.Obstacle
  constructor: (@poly) ->
    return this


  render: (helper) ->
    helper.save()
    helper.fill('#00A')
    helper.translate(@poly.pos.x, @poly.pos.y)
    helper.polygon(@poly.points)
    helper.restore()
