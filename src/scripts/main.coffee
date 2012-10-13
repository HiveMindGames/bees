{ innerWidth: width, innerHeight: height } = window

console.warn width, height
canvasEl = document.getElementById('game')
canvasEl.width = width
canvasEl.height = height

context = canvasEl.getContext('2d')
context.fillRect(10, 20, 200, 100)
