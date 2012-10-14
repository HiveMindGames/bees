class window.Sounds
  constructor: ->
    soundManager.setup
      url: './swf/'
      flashVersion: 9
      useFlashBlock: false
      onready: @on_ready

  on_ready: ->
    soundManager.createSound
      id: 'mySound'
      url: '/path/to/some.mp3'
      autoLoad: true
      autoPlay: false
      onload: ->
      volume: 50
