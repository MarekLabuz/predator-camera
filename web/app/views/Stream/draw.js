function initDraw (canvas, addPoints) {
    const context = canvas.getContext('2d')

    const mouse = {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      drawing: false
    }

    function setMousePosition(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    canvas.onmousemove = function (e) {
      setMousePosition(e)
      if (mouse.drawing) {
        context.clearRect(0, 0, canvas.width, canvas.height)
        context.beginPath()
        context.rect(mouse.startX, mouse.startY, mouse.x - mouse.startX, mouse.y - mouse.startY)
        context.strokeStyle = 'red'
        context.stroke()
        context.closePath()
      }
    }

    canvas.onclick = function () {
      if (mouse.drawing) {
        addPoints(mouse)
        mouse.drawing = false
        context.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        mouse.drawing = true
        mouse.startX = mouse.x
        mouse.startY = mouse.y
      }
    }
}

export default function start (addPoints) {
  initDraw(document.getElementById('canvas'), addPoints)
  console.log('start')
}
