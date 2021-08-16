const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth 
canvas.height = innerHeight
canvasDimensions = {
	x: canvas.width,
	y: canvas.height,
}


const socket = io("http://localhost:3000")

socket.emit('canvas', canvasDimensions)

function drawSquare(x, y) {
	c.beginPath();
	c.rect(x, y, 15, 10);
	c.fillStyle = 'white'
	c.fill()
	
}
function drawProjectile(x,y) {
	c.beginPath() 
	c.arc(x, y, 3, 0, Math.PI * 2, false)
	c.fillStyle = 'red'
	c.fill()		
}

function drawHealthSegment(x,y, colour) {
	c.beginPath();
	c.rect(x, y, 20 / 4, 3);
	c.fillStyle = colour
	c.fill()
}

document.onkeypress = function (e) {
	keyPressCode = e.keyCode
	socket.emit('keypress', keyPressCode)

}

document.onkeyup = function(s){
	keyUpCode = s.keyCode
	socket.emit('keyup', keyUpCode)
}


document.addEventListener('click', (event) => {
	mouseCoords = {
		x: event.clientX,
		y: event.clientY,
	}
	socket.emit('click', mouseCoords)
})



socket.on('players-coords', players => {
	players.forEach((player, index) => {
		drawSquare(players[index].x, players[index].y)

		function handleHealth() {
			if (players[index].health >= 75) {
				drawHealthSegment( players[index].x - 2.5, players[index].y - 10, 'green')
				drawHealthSegment( players[index].x + 5 - 2.5, players[index].y - 10, 'green')
				drawHealthSegment( players[index].x + 10 - 2.5, players[index].y - 10, 'green')
				drawHealthSegment( players[index].x + 15 - 2.5, players[index].y - 10, 'green')
			} else if (players[index].health >= 50) {
				drawHealthSegment( players[index].x - 2.5, players[index].y - 10, 'green')
				drawHealthSegment( players[index].x + 5 - 2.5, players[index].y - 10, 'green')
				drawHealthSegment( players[index].x + 10 - 2.5, players[index].y - 10, 'green')
				drawHealthSegment( players[index].x + 15 - 2.5, players[index].y - 10, 'red')
			} else if (players[index].health >= 25) {
				drawHealthSegment( players[index].x - 2.5, players[index].y - 10, 'green')
				drawHealthSegment( players[index].x + 5 - 2.5, players[index].y - 10, 'green')
				drawHealthSegment( players[index].x + 10 - 2.5, players[index].y - 10, 'red')
				drawHealthSegment( players[index].x + 15 - 2.5, players[index].y - 10, 'red')
			} else if (players[index].health >= 0) {
				drawHealthSegment( players[index].x - 2.5, players[index].y - 10, 'green')
				drawHealthSegment( players[index].x + 5 - 2.5, players[index].y - 10, 'red')
				drawHealthSegment( players[index].x + 10 - 2.5, players[index].y - 10, 'red')
				drawHealthSegment( players[index].x + 15 - 2.5, players[index].y - 10, 'red')
			} else if (players[index].health <= 0) {
				drawHealthSegment( players[index].x - 2.5, players[index].y - 10, 'red')
				drawHealthSegment( players[index].x + 5 - 2.5, players[index].y - 10, 'red')
				drawHealthSegment( players[index].x + 10 - 2.5, players[index].y - 10, 'red')
				drawHealthSegment( players[index].x + 15 - 2.5, players[index].y - 10, 'red')
			}
}
		handleHealth()
	})
})
socket.on('projectiles-coords', projectiles => {
	projectiles.forEach((projectile, projectileIndex) => {
		drawProjectile(projectiles[projectileIndex].x, projectiles[projectileIndex].y)
	})
})
socket.on('fill-canvas', doIt => {
	c.clearRect(0, 0, canvas.width, canvas.height)
})


let animationID
let d
function animate() {
	animationID = requestAnimationFrame(animate)
	socket.emit('game-loop', d)

}
animate()

