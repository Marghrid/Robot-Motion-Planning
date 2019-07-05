class Environment {
	constructor(size, num_obst) {
		this.num_obst = num_obst;
		this.size = size;
		this.obstacles = [];
		this.edges = [];
		this.path = [];	
		this.obst_colour = "rgba(170, 170, 170, 0.95)";
		this.goal_colour = "rgba(  0,  80, 180,  0.8)";
		this.init_colour = "rgba(230,  30, 100,  0.8)";
		this.edge_colour = "rgba(0,   150,  13,  0.8)";
		this.path_colour = "rgba(255, 235,  60,  0.7)";
		this.background  = "rgba(255, 255, 255,    0)";

		this.generate_obstacles();

		this.goal = [0, 0]
		this.init = [0, 0]

		while(euclidean_distance(this.goal, this.init) < this.size 
			||  this.inside_obstacle(this.init) || this.inside_obstacle(this.goal)) {
				this.goal = [Math.random() * (this.size*0.9) + this.size*0.05, Math.random() * (this.size*0.9) + this.size*0.05];
				this.init = [Math.random() * (this.size*0.9) + this.size*0.05, Math.random() * (this.size*0.9) + this.size*0.05];
		}
	}

	draw(canvas) {
		this.ctx = canvas.getContext('2d');
		this.ctx.fillStyle = this.obst_colour;
		this.ctx.beginPath();
		for (let obst of this.obstacles) {
			this.ctx.moveTo(obst[0][0], obst[0][1]);
			for(let pos of obst) {
				this.ctx.lineTo(pos[0], pos[1]);
			}
		}
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.fillStyle = this.background;

		this.ctx.fillStyle = this.init_colour;
		this.ctx.fillRect(this.init[0]-5, this.init[1]-5, 10, 10);
		this.ctx.fillStyle = this.goal_colour;
		this.ctx.fillRect(this.goal[0]-5, this.goal[1]-5, 10, 10);
		this.ctx.fillStyle = this.background;
	}

	update() {
		if(this.edges.length > 0) {
			let e = this.edges.pop();
			this.ctx.strokeStyle = this.edge_colour;
			this.ctx.beginPath();
			this.ctx.moveTo(e[0][0], e[0][1]);
			this.ctx.lineTo(e[1][0], e[1][1]);
			this.ctx.stroke();
			this.ctx.strokeStyle = this.background;
		} 
		else if(this.path.length > 1) {
			let v = this.path.shift(); //pop from the beginning;
			this.ctx.strokeStyle = this.path_colour;
			this.ctx.lineWidth = 5;
			this.ctx.beginPath();
			this.ctx.moveTo(v[0], v[1]);
			this.ctx.lineTo(this.path[0][0], this.path[0][1]);
			this.ctx.stroke();

			this.ctx.lineWidth = 1;
			this.ctx.strokeStyle = this.edge_colour;
			this.ctx.beginPath();
			this.ctx.moveTo(v[0], v[1]);
			this.ctx.lineTo(this.path[0][0], this.path[0][1]);
			this.ctx.stroke();
			this.ctx.strokeStyle = this.background;
		}
	}

	valid_obstacle(poly) {
		for (let ob of this.obstacles) {
			if(polygons_intersect(poly, ob)) {
				return false;
			}
		}
		if(polygons_intersect(poly, [[0,0], [0,this.size], [this.size, this.size], [this.size,0]])) {
			return false;
		}
		return true;
	}

	inside_obstacle(p) {
		for(let obst of this.obstacles)
			if(inside_polygon(p, obst)) return true;

		return false;
	}

	generate_obstacles() {
		while (this.obstacles.length < this.num_obst) {
			let obst_radius = Math.random() * 5 + 2;
			let x = Math.random() * (this.size - obst_radius) + obst_radius/2;
			let y = Math.random() * (this.size - obst_radius) + obst_radius/2;
			let sides = Math.round(Math.random() * 4 + 3);
			let poly = generatePolygon(x, y, this.size/6, 0.6, 0.005, sides);
			if(this.valid_obstacle(poly))
				this.obstacles.push(poly)
		}
	}

	visible(p,q) {
		for (let obs of this.obstacles) {
			if (intersect_polygon([p,q], obs))
				return false;
			if (inside_polygon([(p[0] + q[0])/2 ,(p[1] + q[1])/2], obs, 500))
				return false;
		}
		return true;
	}
}