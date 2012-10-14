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
    soundManager.createSound
      id: 'landing'
      url: './sounds/landing.mp3'
      autoLoad: true
      autoPlay: false
      volume: 80
    soundManager.createSound
      id: 'collision'
      url: './sounds/collision.mp3'
      autoLoad: true
      autoPlay: false
      volume: 50
    soundManager.createSound
      id: 'thoughtbubble'
      url: './sounds/thoughtbubble.mp3'
      autoLoad: true
      autoPlay: false
      volume: 50

helper = new CanvasHelper(document.getElementById('game'))

targets = []
target_count = 4

for i in [0..target_count]
  if i is target_count
    targets.push({
      src: 'images/hive.png',
      width: 190,
      height: 245,
      position: new SAT.Vector(((helper.half_width / 2) * i) + 200, helper.height),
      stem_height: helper.half_height / 2,
      angle: 0,
      final: true
    })
  else if i is 0
    targets.push({
      src: 'images/petals.png',
      width: 128,
      height: 64,
      position: new SAT.Vector(((helper.half_width / 2) * i) + 200, helper.height),
      stem_height: helper.half_height / 2,
      angle: 10
    })
  else
    targets.push({
      src: 'images/petals.png',
      width: 128,
      height: 64,
      position: new SAT.Vector(((helper.half_width / 2) * i) + 200, helper.height),
      stem_height: helper.half_height / 2,
      angle: Math.floor(15 - (Math.random() * 30))
    })

world = new World(helper, {
  width: helper.width * 2,
  height: helper.height
  bee: {
    src: 'images/bee.png',
    x: 256,
    y: (helper.half_height * 1.5) - 48
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
  targets: targets,
  obstacles: [
    new SAT.Box(new SAT.Vector(helper.half_width, helper.half_height), 70, 70).toPolygon()
  ]
})

helper.render (delta) ->
  world.render(helper, delta)
