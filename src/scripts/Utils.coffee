window.Utils = {}

window.Utils.degToRad = (degrees) ->
  return degrees * (Math.PI / 180)

window.Utils.radToDeg = (radians) ->
  return radians * (180 / Math.PI)
