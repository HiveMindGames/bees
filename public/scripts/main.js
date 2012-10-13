(function() {
  var canvasEl, context, height, width;

  width = window.innerWidth, height = window.innerHeight;

  console.warn(width, height);

  canvasEl = document.getElementById('game');

  canvasEl.width = width;

  canvasEl.height = height;

  context = canvasEl.getContext('2d');

  context.fillRect(10, 20, 200, 100);

}).call(this);
