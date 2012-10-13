class window.Bee
  deceleration: 0.2
  drag: 0.9
  size: 64
  
  is_flying: false

  gravity: new Vector(0, 1)

  constructor: ->
    @half_size = @size / 2

    @position = new Vector()
    @velocity = new Vector()
    @acceleration = new Vector()

  contains: (mouse) ->
    { x, y } = mouse
    return x > (@position.x - @half_size) and
      x < (@position.x + @half_size) and
      y > (@position.y - @half_size) and
      y < (@position.y + @half_size)

  update: ->
    @acceleration.multiply_scalar(@deceleration)

    if @is_flying
      @acceleration.add(@gravity)

    @velocity.add(@acceleration)
    @position.add(@velocity)
    @velocity.multiply_scalar(@drag)

  render: (helper) ->
    @update()

    helper.fill('#000')
    helper.save()
    helper.translate(@position.x, @position.y)
    helper.rect(0, 0, @size, @size)
    helper.restore()   
