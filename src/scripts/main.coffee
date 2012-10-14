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

worldHeight = 600
targets = []
target_count = 4

for i in [0..target_count]
  targets.push({
    src: 'images/petals.png',
    width: 128,
    height: 64,
    position: new SAT.Vector(((helper.half_width / 2) * i) + 200, worldHeight),
    stem_height: helper.half_height / 2,
    angle: if i is 0 then 10 else Math.floor(15 - (Math.random() * 30))
    final: i is target_count
  })

world = new World(helper, {
  width: 2000,
  height: worldHeight,
  viewWidth: 800,
  viewHeight: 600
  bee: {
    src: 'images/bee.png',
    x: 256,
    y: worldHeight - 160
    width: 64
    height: 74
  },
  backgrounds: [{
      src: 'images/sky.png',
      width: 12,
      height: 800,
      x: 0,
      y: -200,
      repeat: true,
      increment: 0
    }, {
      src: 'images/clouds.png',
      width: 1060,
      height: 550,
      x: 0,
      y: worldHeight - 550,
      increment: 1
    }, {
      src: 'images/mountains.png',
      width: 1060,
      height: 250,
      x: 0,
      y: worldHeight - 250,
      increment: 2
    }, {
      src: 'images/hills.png',
      width: 1060,
      height: 180,
      x: 0,
      y: worldHeight - 180,
      increment: 3
    }, {
      src: 'images/trees.png',
      width: 1060,
      height: 180,
      x: 0,
      y: worldHeight - 180,
      increment: 4
  }],
  targets: targets,
  obstacles: [
    # new SAT.Box(new SAT.Vector(10, 10), 30, 200).toPolygon()
  ]
})

helper.render (delta) ->
  world.render(helper, delta)
