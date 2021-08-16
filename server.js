const { instrument } = require('@socket.io/admin-ui')
const io = require('socket.io')(3000, {
	cors: {
		origin: ["http://localhost:8080", "https://admin.socket.io"],
		credentials: true,

	},
})

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}



class Player {
	constructor(x, y, health, id, screenX, screenY) {
		this.x = x
		this.screenCoords = {
			x: screenX,
			y: screenY,
		}			
		this.y = y
		this.color = 'white'
		this.velocity = {
			x:0,
			y:0,
		}
		this.velocity.x = 0
		this.velocity.y = 0
		this.health = health
		this.id = id
		this.cameraCoords = {
			x: 0,
			y: 0,
		}
		this.cameraVelocity = {
			x: 0,
			y: 0,
		}
		this.direction = 1 //1 is right 0 is left
		this.animationFrame = 0
		

	}
	update() {
		this.x += this.velocity.x
		this.y += this.velocity.y
		this.cameraCoords.x += this.cameraVelocity.x
		this.cameraCoords.y += this.cameraVelocity.y
	
}}
let whichIndexReborn = 0;
	
class Projectile {
	constructor(x,y, radius, velocity, id, worldX, worldY, cameraX, cameraY) {
		this.x = x
		this.y = y
		this.radius = radius
		this.velocity = velocity
		this.id = id
		this.worldCoords = {
			x: worldX,
			y: worldY,
		}
		this.cameraCoords = {
			x: cameraX,
			y: cameraY,
		}
	}

	update() {
		this.x += this.velocity.x
		this.y += this.velocity.y
		for (let i = 0; i < players.length; i++) {
			if (this.id === playerIdList[i]) {
				whichIndexReborn = i
				this.x -= (players[i].cameraVelocity.x)
				this.y -= (players[i].cameraVelocity.y)
				this.worldCoords.x -= (players[i].cameraVelocity.x)
				this.worldCoords.y -= (players[i].cameraVelocity.y)
			}
		}
		this.worldCoords.x += this.velocity.x
		this.worldCoords.y += this.velocity.y
	}
}

	
let keyW = false
let keyA = false
let keyS = false
let keyD = false
let keyP = false
let keyupW = false
let keyupA = false
let keyupS = false
let keyupD = false


let projectile = new Projectile( 500, 325, 3,{x : 1,y : 1});
let projectiles = [];
let playerIdList = [];
let players = [];


io.on("connection", socket => {
	socket.on("disconnect", (reason) => {
		for (let i = 0; i < players.length; i++) {
			if (socket.id === playerIdList[i]) {
				players.splice([i], 1)
				playerIdList.splice([i], 1)
				console.log(`player ${(i + 1)} has disconnected`)
			}
		}
	})
	
	
	socket.setMaxListeners(50);	
	playerIdList.push(socket.id)
	let player = new Player(300, 300, 100, socket.id);
	

	io.emit('id-list', playerIdList)



	socket.on('keypress', keyPressCode => {
		
		keyupW = false
		keyupA = false
		keyupS = false
		keyupD = false


		switch (keyPressCode) {
			case 119: return keyW = true
			case 100: return keyD = true
			case 115: return keyS = true
			case 97: return keyA = true
			}

		})

	socket.on('keyup', keyUpCode => {
		
		keyW = false
		keyA = false
		keyS = false
		keyD = false


		switch (keyUpCode){
			case 87: return keyupW = true 
			case 65: return keyupA = true
			case 83: return keyupS = true
			case 68: return keyupD = true 



		}

	})



	function handlemovement() {
		for (let i = 0; i < players.length; i++) {
			if (socket.id === playerIdList[i]) {
				if (keyW === true) {
					players[i].velocity.y = -10
					players[i].cameraVelocity.y = -10
					

						
				}
				if (keyA === true) {
				players[i].cameraVelocity.x = -10
					players[i].velocity.x = -10
					players[i].direction = 0
				}	
				if (keyS === true) {
					players[i].cameraVelocity.y = 10
					players[i].velocity.y = 10
					

				}
				if (keyD === true ) {
					players[i].cameraVelocity.x = 10
					players[i].velocity.x = 10
					players[i].direction = 1

					
				} 
				if (keyupW || keyupS) {
					players[i].velocity.y = 0
				players[i].cameraVelocity.y = 0
					keyW = false
					keyA = false
					keyS = false
					keyD = false
				} 
				if (keyupA || keyupD) {
					players[i].velocity.x = 0
					players[i].cameraVelocity.x = 0
					

					keyW = false
					keyA = false
					keyS = false
					keyD = false

				}
	}}
}




socket.on('canvas', canvasDimensions => {

	players.push(new Player((canvasDimensions.x / 2), (canvasDimensions.y / 2), 100, socket.id, (canvasDimensions.x / 2), (canvasDimensions.y / 2)))//Math.random() * canvasDimensions.x\


let donald;

		// ----------INSIDE GAME LOOP---------------
		socket.on('game-loop', dddd => {
			console.log(players)
			console.log(projectiles)
			handlemovement()
			io.emit('fill-canvas', donald)
			players.forEach((player, index) => {
				if (players[index].cameraCoords.x > 5120 - canvasDimensions.x) {
					players[index].x = (5120 - canvasDimensions.x) + (canvasDimensions.x / 2)
					players[index].cameraCoords.x = 5120 - canvasDimensions.x
				} 
				 if (players[index].cameraCoords.x < 0) {
					players[index].x = 0 + (canvasDimensions.x / 2)
					players[index].cameraCoords.x = 0
				}
				 if (players[index].cameraCoords.y > 4480 - canvasDimensions.y) {
					players[index].y = 4480 - canvasDimensions.y + (canvasDimensions.y / 2)
					players[index].cameraCoords.y = 4480 - canvasDimensions.y
				}
				if (players[index].cameraCoords.y < 0){
					players[index].y = 0 + (canvasDimensions.y / 2)
					players[index].cameraCoords.y = 0
				}
			 })
			
			io.emit('players-coords', players)
			
			io.emit('projectiles-coords', projectiles)
			

			projectiles.forEach((projectile, projectileIndex) => {
				projectile.update()
				if (projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvasDimensions.x || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvasDimensions.y) {
					setTimeout(() => {
					projectiles.splice(projectileIndex, 1)
					
				}, 0)
			}})

			players.forEach((player, index) => {
				// if ((cameraCoords.x !== (players[index].x - (canvasDimensions.x / 2))|| cameraCoords.y !== players[index].y - (canvasDimensions.y / 2)) && players[index].velocity.x === 0 && players[index].velocity.y === 0){
				// 		console.log('isnt synced')
				// 		cameraCoords.x = (players[index].x - (canvasDimensions.x / 2))
				// 		cameraCoords.y = (players[index].y - (canvasDimensions.y / 2))
				// }
				player.update() 

				/*
				if (players[index].x > canvasDimensions.x - 15) {
					players[index].x = canvasDimensions.x - 15
					
				}
				if (players[index].x < 0) {
					players[index].x = 0
					
				}
				if (players[index].y > canvasDimensions.y - 10) {
					players[index].y = canvasDimensions.y - 10
					
				}
				if (players[index].y < 0){
					players[index].y = 0
					
				}
				*/
				projectiles.forEach((projectile, projectileIndex) => {
					

			let dist = Math.hypot(projectile.x - players[index].x, projectile.y - players[index].y)
				for (let i = 0; i < players.length; i++) {
					if (socket.id === playerIdList[i]) {				
						if (dist < 11) {

								if (index !== i) {
									
								projectiles.splice(projectileIndex, 1)
														
								//} else {

									players[index].health -= 1

									if (players[index].health <= 0) { 
										console.log(`player ${index + 1} is dead`)

									}

								//}
									}
								}

										
									
								}
							
							}
						//} 
					})
				
			})
})


	for (let i = 0; i < players.length; i++) {
		if (socket.id === playerIdList[i]) {
			console.log(`player ${(i + 1)} has connected with id: ${playerIdList[i]}`)
		}
	}

		socket.on('click', (mouseCoords) => {
			players.forEach((player, index) => {
			for (let i = 0; i < players.length; i++) {
				if (socket.id === playerIdList[i]) {
					var angle = Math.atan2(
						mouseCoords.y - (players[i].y - players[i].cameraCoords.y),
						mouseCoords.x - (players[i].x - players[i].cameraCoords.x),
						)

					var velocity = {
						x: Math.cos(angle) * 3,
						y: Math.sin(angle) * 3,
					}
					
					projectiles.push(new Projectile(players[i].x - players[i].cameraCoords.x, players[i].y - players[i].cameraCoords.y, 3, velocity, socket.id, players[i].x, players[i].y, players[i].cameraCoords.x, players[i].cameraCoords.y))
			}}		
			})
		})
})
})
instrument(io, {auth:false})


