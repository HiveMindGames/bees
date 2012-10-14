class window.Bee
  precision: 10
  drag: 0.1
  lives: 3

  is_flying: false
  distance: 0

  points: 0

  thinking: null

  gravity: new SAT.Vector(0, 900)

  constructor: (@options) ->
    { @src, @width, @height, x, y } = @options

    @half_width = @width / 2
    @half_height = @height / 2

    @image = new Image()
    @image.src = @src

    @hive_image = new Image()
    @hive_image.src = 'images/thought_hive.png'

    @thought_image = new Image()
    @thought_image.src = 'images/thought.png'

    @position = @last_position = new SAT.Vector(x, y)

    @velocity = new SAT.Vector()
    @acceleration = new SAT.Vector()

    @update_bounding_box()

  update_bounding_box: ->
    @bounding_box = (new SAT.Box(new SAT.Vector(
      @position.x - @half_width + @precision,
      @position.y - @half_height + @precision
    ), @width - @precision, @height - @precision)).toPolygon()

  simulate: (dt) ->
    return if not @is_flying

    da = @evaluate(0.0, null)
    db = @evaluate(dt * 0.5, da)
    dc = @evaluate(dt * 0.5, db)
    dd = @evaluate(dt, dc)

    da.dpos.add(db.dpos.add(dc.dpos).scale(2)).add(dd.dpos).scale(1 / 6)
    da.dvel.add(db.dvel.add(dc.dvel).scale(2)).add(dd.dvel).scale(1 / 6)

    dpos = da.dpos.scale(dt)

    @distance += dpos.len()

    @last_position = (new SAT.Vector()).copy(@position)
    @position.add dpos
    @velocity.add da.dvel.scale(dt)
    @update_bounding_box()

  evaluate: (dt, deriv) ->
    initial_pos = (new SAT.Vector()).copy(@position)
    initial_vel = (new SAT.Vector()).copy(@velocity)

    if deriv
      initial_pos.add((new SAT.Vector()).copy(deriv.dpos).scale(dt))
      initial_vel.add((new SAT.Vector()).copy(deriv.dvel).scale(dt))

    return {
      dpos: (new SAT.Vector()).copy(initial_vel),
      dvel: (new SAT.Vector()).copy(@gravity).sub((new SAT.Vector()).copy(initial_vel).scale(@drag))
    }

  render: (helper) ->
    helper.save()
    helper.translate(@position.x, @position.y)
    helper.translate(@drag_dx.x, @drag_dx.y) if @drag_dx
    helper.translate(-@half_width, -@half_height)
    helper.render_image(@image, 0, 0, @width, @height)

    if @thinking
      helper.save()
      if @thinking is 'hive'
        helper.translate(40, -60)
        helper.render_image(@thought_image, 0, 0, 105, 80)
        helper.render_image(@hive_image, 25, 12, 45, 30)
      else if @thinking is 'points'
        helper.fill('rgb(145, 126, 52)')
        helper.translate(40, -80)
        helper.render_image(@thought_image, 0, 0, 135, 100)
        helper.text("+#{@points}", 68, 38, font='28px "Sniglet", cursive', null, 'center', 'middle')
      helper.restore()

    helper.restore()
