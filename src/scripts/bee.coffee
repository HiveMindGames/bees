class window.Bee
  deceleration: 0.15
  drag: 0.9
  size: 8
  half_size: 4

  constructor: ->
    @gravity = new Vector(0, 1)

    @position = new Vector()
    @velocity = new Vector()
    @acceleration = new Vector()

  update: ->
    @acceleration.multiply_scalar(@deceleration)
    @acceleration.add(@gravity)

    @velocity.add(@acceleration)
    @position.add(@velocity)
    @velocity.multiply_scalar(@drag)

  render: (helper) ->
    @update()

    { x, y } = @position

    helper.fill('#000')
    helper.save()
    helper.translate(x - @half_size, y - @half_size)
    helper.rect(0, 0, @size, @size)
    helper.restore()   
