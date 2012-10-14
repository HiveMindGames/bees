(function() {
  var helper, i, target_count, targets, world, _i;

  soundManager.setup({
    url: './swf/',
    flashVersion: 9,
    useFlashBlock: false,
    onready: function() {
      soundManager.createSound({
        id: 'background',
        url: './sounds/background.mp3',
        autoLoad: true,
        autoPlay: true,
        volume: 10
      });
      soundManager.createSound({
        id: 'bounce1',
        url: './sounds/bounce1.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 50
      });
      soundManager.createSound({
        id: 'bounce2',
        url: './sounds/bounce2.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 50
      });
      soundManager.createSound({
        id: 'bounce3',
        url: './sounds/bounce3.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 50
      });
      soundManager.createSound({
        id: 'buzz',
        url: './sounds/buzz.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 20
      });
      soundManager.createSound({
        id: 'stretch',
        url: './sounds/stretch.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 50
      });
      soundManager.createSound({
        id: 'spring',
        url: './sounds/spring.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 50
      });
      soundManager.createSound({
        id: 'victory',
        url: './sounds/victory.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 50
      });
      soundManager.createSound({
        id: 'collision',
        url: './sounds/collision.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 50
      });
      return soundManager.createSound({
        id: 'thoughtbubble',
        url: './sounds/thoughtbubble.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 50
      });
    }
  });

  helper = new CanvasHelper(document.getElementById('game'));

  targets = [];

  target_count = 4;

  for (i = _i = 0; 0 <= target_count ? _i <= target_count : _i >= target_count; i = 0 <= target_count ? ++_i : --_i) {
    targets.push({
      src: 'images/petals.png',
      width: 128,
      height: 64,
      position: new SAT.Vector((helper.half_width * i) + 200, helper.height),
      stem_height: 220,
      angle: i === 0 ? 10 : Math.floor(25 - (Math.random() * 50)),
      final: i === target_count
    });
  }

  world = new World(helper, {
    width: helper.width * 2,
    height: helper.height,
    bee: {
      src: 'images/bee.png',
      x: 248,
      y: helper.height - 272,
      width: 64,
      height: 74
    },
    backgrounds: [
      {
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
      }
    ],
    targets: targets,
    obstacles: []
  });

  helper.render(function(delta) {
    return world.render(helper, delta);
  });

}).call(this);
