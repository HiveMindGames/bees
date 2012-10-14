soundManager.setup
  url: './swf/'
  flashVersion: 9
  useFlashBlock: false
  onready: ->
    soundManager.createSound
      id: 'background'
      url: './sounds/background.mp3'
      autoLoad: true
      autoPlay: true
      volume: 10
    soundManager.createSound
      id: 'bounce1'
      url: './sounds/bounce1.mp3'
      autoLoad: true
      autoPlay: false
      volume: 50
    soundManager.createSound
      id: 'bounce2'
      url: './sounds/bounce2.mp3'
      autoLoad: true
      autoPlay: false
      volume: 50
    soundManager.createSound
      id: 'bounce3'
      url: './sounds/bounce3.mp3'
      autoLoad: true
      autoPlay: false
      volume: 50
    soundManager.createSound
      id: 'buzz'
      url: './sounds/buzz.mp3'
      autoLoad: true
      autoPlay: false
      volume: 20
    soundManager.createSound
      id: 'stretch'
      url: './sounds/stretch.mp3'
      autoLoad: true
      autoPlay: false
      volume: 50
    soundManager.createSound
      id: 'spring'
      url: './sounds/spring.mp3'
      autoLoad: true
      autoPlay: false
      volume: 50
    soundManager.createSound
      id: 'victory'
      url: './sounds/victory.mp3'
      autoLoad: true
      autoPlay: false
      volume: 50

helper = new CanvasHelper(document.getElementById('game'))

world = new World(helper, {
  width: helper.width * 2,
  height: helper.height
  bee: {
    src: 'images/bee.png',
    x: 264,
    y: helper.height - 260
    width: 64
    height: 74
  },
  backgrounds: [{
    src: 'images/sky.png',
    width: 12,
    height: 800,
    x: 0,
    y: 0,
    repeat: true,
    increment: 0
  }, {
    src: 'images/clouds.png',
    width: 1060,
    height: 550,
    x: 0,
    y: 0,
    increment: 1
  }, {
    src: 'images/mountains.png',
    width: 1060,
    height: 250,
    x: 0,
    y: 0,
    increment: 2
  }, {
    src: 'images/hills.png',
    width: 1060,
    height: 180,
    x: 0,
    y: 0,
    increment: 3
  }, {
    src: 'images/trees.png',
    width: 1060,
    height: 180,
    x: 0,
    y: 0,
    increment: 4
  }],
  targets: [{
    src: 'images/petals.png',
    width: 128,
    height: 64,
    position: new SAT.Vector(200, helper.height),
    stem_height: 220,
    angle: 15
  }, {
    src: 'images/petals.png',
    width: 128,
    height: 64,
    position: new SAT.Vector(helper.half_width - 200, helper.height),
    stem_height: 230,
    angle: 5
  }, {
    src: 'images/petals.png',
    width: 128,
    height: 64,
    position: new SAT.Vector(helper.half_width + 150, helper.height),
    stem_height: 200,
    angle: -15
  }, {
    src: 'images/petals.png',
    width: 128,
    height: 64,
    position: new SAT.Vector(helper.half_width + 450, helper.height),
    stem_height: 240,
    angle: -25,
    final: true
  }],
  obstacles: [
    new SAT.Box(new SAT.Vector(10, 10), 30, 200).toPolygon()
    new SAT.Box(new SAT.Vector(helper.half_width + 450, 10), 300, 30).toPolygon()
    new SAT.Box(new SAT.Vector(helper.half_width + 450, 200), 300, 30).toPolygon()
    new SAT.Box(new SAT.Vector(helper.half_width + 700, 10), 30, 200).toPolygon()
  ]
})

helper.render (delta) ->
  world.render(helper, delta)
