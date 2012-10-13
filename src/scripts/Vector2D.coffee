class window.Vector 
  constructor: (@x=0, @y=0) ->
    return this

  toJSON: -> { x: @x, y: @y }

  toString: -> "(#{@x},#{@y})"

  copy: -> new Vector(@x, @y)

  add: (v) ->
    @x += v.x
    @y += v.y
    return this

  subtract: (v) ->
    @x -= v.x
    @y -= v.y
    return this

  multiply_scalar: (val) ->
    @x *= val
    @y *= val
    return this

  add_scalar: (val) ->
    @x += val
    @y += val
    return this

  subtract_scalar: (val) ->
    @x -= val
    @y -= val
    return this

  rotate: (radians) ->
    new_x = @x * Math.cos(radians) - @y * Math.sin(radians)
    new_y = @x * Math.sin(radians) + @y * Math.cos(radians)
    @x = new_x
    @y = new_y
    return this

  dot: (v) -> @x * v.x + @y * v.y

  heading: ->
    copy = @copy().normalize()
    return -1 * Math.atan2(-copy.y, copy.x)

  normalize: ->
    magnitude = @magnitude()
    if magnitude isnt 0
      @x /= magnitude
      @y /= magnitude
    return this

  squared_magnitude: -> @x * @x + @y * @y

  magnitude: -> Math.sqrt(@squared_magnitude())

Vector.copy = (v) ->
  return new Vector(v.x, v.y)

Vector.add = (v1, v2) ->
  return new Vector(v1.x + v2.x, v1.y + v2.y)

Vector.subtract = (v1, v2) ->
  return new Vector(v1.x - v2.x, v1.y - v2.y)

Vector.multiply_scalar = (v, val) ->
  return new Vector(v.x * val, v.y * val)

Vector.divide_scalar = (v, val) ->
  return new Vector(v.x / val, v.y / val)

Vector.add_scalar = (v, val) ->
  return new Vector(v.x + val, v.y + val)

Vector.subtract_scalar = (v, val) ->
  return new Vector(v.x - val, v.y - val)

Vector.rotate = (v, radians) ->
  new_x = v.x * Math.cos(radians) - v.y * Math.sin(radians)
  new_y = v.x * Math.sin(radians) + v.y * Math.cos(radians)
  return new Vector(new_x, new_y)

Vector.dot = (v1, v2) ->
  return v1.x * v2.x + v1.y * v2.y

Vector.distance = (v1, v2) ->
  return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))

Vector.squared_distance = (v1, v2) ->
  return (Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2))

Vector.normalize = (v) ->
  v = v.copy()
  magnitude = v.magnitude()
  if (magnitude not 0)
    v.x /= magnitude
    v.y /= magnitude
  return v
