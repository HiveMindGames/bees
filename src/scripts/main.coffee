helper = new CanvasHelper(document.getElementById('game'))

world = new World(helper, {
  bee: {
    x: 264,
    y: helper.height - 290
  },
  backgrounds: [{
    src: '/images/bkg_0.png',
    width: 1698,
    height: 320,
    x: 0,
    y: 0,
    increment: 6
  }, {
    src: '/images/bkg_1.png',
    width: 1704,
    height: 320,
    x: 0,
    y: 0,
    increment: 12
  }, {
    src: '/images/bkg_2.png',
    width: 1707,
    height: 320,
    x: 0,
    y: 0,
    increment: 24
  }],
  flowers: [{
    petal_width: 128,
    petal_height: 64,
    position: new SAT.Vector(200, helper.height),
    stem_height: 240,
    angle: 15
  }, {
    petal_width: 128,
    petal_height: 64,
    position: new SAT.Vector(helper.half_width - 200, helper.height),
    stem_height: 240,
    angle: 5
  }, {
    petal_width: 128,
    petal_height: 64,
    position: new SAT.Vector(helper.half_width + 350, helper.height),
    stem_height: 240,
    angle: -25
  }]
})

helper.render ->
  world.render(helper)
