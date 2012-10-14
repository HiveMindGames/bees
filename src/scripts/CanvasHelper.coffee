class window.CanvasHelper
  should_stroke: false
  should_fill: true
  
  ticks: 0

  constructor: (@canvas=document.createElement('canvas'), @width=window.innerWidth, @height=window.innerHeight) ->
    @canvas.width = @width
    @canvas.height = @height

    @context = @canvas.getContext('2d')

    @half_width = @width / 2
    @half_height = @height / 2

  no_stroke: -> @should_stroke = false
  no_fill: -> @should_fill = false
  
  stroke: (color) ->
    @should_stroke = true
    @context.strokeStyle = color

  fill: (color) ->
    @should_fill = true
    @context.fillStyle = color

  stroke_width: (width) -> @context.lineWidth = width

  translate: (x=0, y=0) -> @context.translate(x, y)
  rotate: (angle=0) -> @context.rotate(angle)
  scale: (scale_x=0, scale_y=scale_x) -> @context.scale(scale_x, scale_y)

  save: -> @context.save()
  restore: -> @context.restore()

  render_image: (src, x=0, y=0, width=@width, height=@height) ->
    if typeof src isnt 'string'
      @context.drawImage(src, x, y, width, height)
      return

    image = new Image()
    image.onload = -> @context.drawImage(image, x, y, width, height)
    image.src = src

  text: (value, x, y, font='14px Helvetica, Arial, sans-serif', lineHeight=18, textAlign='left', textBaseline='top') ->
    value = value.toString() if typeof value isnt 'string'
    @context.font = font
    @context.textAlign = textAlign
    @context.textBaseline = textBaseline
    lines = value.split('\n')
    @context.fillText(line, x, y + i * lineHeight) for i, line of lines

  rect: (x=0, y=0, width=@width, height=@height) ->
    half_width = width / 2
    half_height = height / 2
    if @should_fill
      @context.fillRect(x - half_width, y - half_height, width, height)
    if @should_stroke
      @context.strokeRect(x - half_width, y - half_height, width, height)

  clear: (x=0, y=0, width=@width, height=@height) ->
    @context.clearRect(x, y, @width, @height)

  circle: (x=0, y=0, radius = 10) ->
    @context.beginPath()
    @context.arc(x, y, radius, 0, Math.PI * 2, true)
    @context.closePath()
    @context.fill() if @should_fill
    @context.stroke() if @should_stroke

  polygon: (points) ->
    @context.beginPath()
    @context.moveTo(points[0].x, points[0].y)
    @context.lineTo(points[i].x, points[i].y) for i in [1...points.length]
    @context.closePath()
    @context.fill() if @should_fill

  get_animation_frame: ->
    return window.requestAnimationFrame or
           window.webkitRequestAnimationFrame or
           window.mozRequestAnimationFrame or
           window.oRequestAnimationFrame or
           (callback, element) -> window.setTimeout(callback, 1000 / 60)

  step: (timestamp) =>
    @clear()
    time = Date.now()
    @last_time = time if not @last_time
    @render_callback time - @last_time
    @last_time = time
    @ticks++
    @get_animation_frame()(@step, @canvas)

  render: (@render_callback) -> @step()
