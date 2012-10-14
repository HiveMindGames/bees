window.Utils =
  degToRad: (degrees) ->
    return degrees * (Math.PI / 180)

  radToDeg: (radians) ->
    return radians * (180 / Math.PI)

  rotateVector: (vector, radians) ->
    x = vector.x * Math.cos(radians) - vector.y * Math.sin(radians)
    y = vector.x * Math.sin(radians) + vector.y * Math.cos(radians)
    vector.x = x
    vector.y = y
    return vector
