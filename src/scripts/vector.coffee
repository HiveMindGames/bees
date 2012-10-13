# specifies the Vector class, simplifying many trigonometric operations

# creates a new instance of Vector

class window.Vector 

  constructor: (@x = 0, @y = 0) ->
    return this


  toJSON: ->
    json = {}
    
    json['x'] = @x
    json['y'] = @y
    json['heading'] = @heading()
    
    return json


  copy: ->
    return new Vector(@x, @y)


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


  dot: (v) ->
    return @x * v.x + @y * v.y


  heading: ->
    copy = @copy().normalize()
    return -1 * Math.atan2(-copy.y, copy.x)


  normalize: ->
    magnitude = @magnitude()
    
    if magnitude isnt 0
      @x /= magnitude
      @y /= magnitude
    
    return this


  squared_magnitude: ->
    return @x * @x + @y * @y


  magnitude: ->
    return Math.sqrt(@x * @x + @y * @y)


  toString: ->
    return '(' + @x + ', ' + @y + ')'


Vector.copy = (v) ->
  return new Vector(v.x, v.y)


Vector.add = (v1, v2) ->
  return new Vector(v1.x + v2.x, v1.y + v2.y)


Vector.subtract = (v1, v2) ->
  return new Vector(v1.x - v2.x, v1.y - v2.y)


Vector.multiply_scalar = (v, val) ->
  return new Vector(v.x * val, v.y * val)


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


# http://sirisian.pastebin.com/f150d8f44
 
Vector.line_circle_intersection = (vertex1, vertex2, circlePosition, radius) ->
  vertex1to2 = Vector.subtract(vertex2, vertex1)
  circleToVertex1 = Vector.subtract(circlePosition, vertex1)
  dot = Vector.dot(vertex1to2, circleToVertex1)
  proj1 = Vector.multiply_scalar(vertex1to2, (dot / vertex1to2.squared_magnitude()))
  midpt = Vector.add(vertex1, proj1)
  circleToMidpt = Vector.subtract(midpt, circlePosition)
  distSqToCenter = circleToMidpt.squared_magnitude()
  distToIntersection
  squared_radius = Math.pow(radius, 2)
  
  if (distSqToCenter > squared_radius)
    return []

  if (distSqToCenter is squared_radius)
    return [midpt]
  
  if (distSqToCenter is 0)
    distToIntersection = radius
  else
    distToIntersection = Math.sqrt(squared_radius - distSqToCenter)
  
  vertex1to2 = vertex1to2.normalize()
  vertex1to2.multiply_scalar(distToIntersection)
  
  return [Vector.add(midpt, vertex1to2), Vector.subtract(midpt, vertex1to2)]


# http://sirisian.pastebin.com/f150d8f44

Vector.ray_circle_intersection = (vertex1, vertex2, circlePosition, radius) ->
  result = []
  vertex1to2 = Vector.subtract(vertex2, vertex1)
  solutions = Vector.line_circle_intersection(vertex1, vertex2, circlePosition, radius)
  vertex1ToSolution2
  vertex1ToSolution1

  if (solutions.length is 2)
    vertex1ToSolution2 = Vector.subtract(solutions[1], vertex2)

    if (vertex1ToSolution2.dot(vertex1to2) > 0)
      result.push(solutions[1])

  if (solutions.length is 1)
    vertex1ToSolution1 = Vector.subtract(solutions[0], vertex2)

    if (vertex1ToSolution1.dot(vertex1to2) > 0)
      result.push(solutions[0])

  return result
