(function() {
  var helper, world;

  soundManager.setup({
    url: './swf/',
    flashVersion: 9,
    useFlashBlock: false,
    onready: function() {
      soundManager.createSound({
        id: 'background',
        url: './sounds/background.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 20
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
      return soundManager.createSound({
        id: 'buzz',
        url: './sounds/buzz.mp3',
        autoLoad: true,
        autoPlay: false,
        volume: 50
      });
    }
  });

  helper = new CanvasHelper(document.getElementById('game'));

  world = new World(helper, {
    bee: {
      x: 264,
      y: helper.height - 310
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
    flowers: [
      {
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
      }
    ],
    obstacles: [new SAT.Box(new SAT.Vector(10, 10), 30, 200).toPolygon(), new SAT.Box(new SAT.Vector(helper.half_width + 450, 10), 300, 30).toPolygon(), new SAT.Box(new SAT.Vector(helper.half_width + 450, 200), 300, 30).toPolygon(), new SAT.Box(new SAT.Vector(helper.half_width + 700, 10), 30, 200).toPolygon()]
  });

  helper.render(function(delta) {
    return world.render(helper, delta);
  });

}).call(this);
