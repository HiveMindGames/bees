class window.Bee
  drag: 0.1
  size: 64

  is_flying: false
  distance: 0

  gravity: new SAT.Vector(0, 900)

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


    helper.fill('#000')
    helper.save()
    helper.translate(@position.x, @position.y)
    if @drag_dx
      helper.translate(@drag_dx.x, @drag_dx.y)
    helper.rect(0, 0, @size, @size)
    helper.restore()   
