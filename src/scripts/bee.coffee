class window.Bee
  deceleration: 0.2
  drag: 0.9
  size: 64
  
  is_flying: false

  gravity: new SAT.Vector(0, 1)

  constructor: (@options) ->
    { x, y } = @options
    @position = @last_position = new SAT.Vector(x, y)
    @half_size = @size / 2

    @velocity = new SAT.Vector()
    @acceleration = new SAT.Vector()

    @update_bounding_box()

  update_bounding_box: ->
    @bounding_box = (new SAT.Box(new SAT.Vector(
      @position.x - @half_size,
      @position.y - @half_size
    ), @size, @size)).toPolygon()

  update: ->
    @acceleration.scale(@deceleration, @deceleration)
    @acceleration.add(@gravity)

    @velocity.add(@acceleration)
    @last_position = (new SAT.Vector()).copy(@position)
    @position.add(@velocity)
    @update_bounding_box()
    @velocity.scale(@drag, @drag)

  render: (helper) ->
    if @is_flying
      @update()

    helper.fill('#000')
    helper.save()
    helper.translate(@position.x, @position.y)
    if @drag_dx
      helper.translate(@drag_dx.x, @drag_dx.y)
    helper.rect(0, 0, @size, @size)
    helper.restore()   
