(function() {

  window.Sounds = (function() {

    function Sounds() {
      soundManager.setup({
        url: './swf/',
        flashVersion: 9,
        useFlashBlock: false,
        onready: this.on_ready
      });
    }

    Sounds.prototype.on_ready = function() {
      return soundManager.createSound({
        id: 'mySound',
        url: '/path/to/some.mp3',
        autoLoad: true,
        autoPlay: false,
        onload: function() {},
        volume: 50
      });
    };

    return Sounds;

  })();

}).call(this);
