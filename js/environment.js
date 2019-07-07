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
			|| this.inside_obstacle(this.init) || this.inside_obstacle(this.goal)) {
			
			this.goal = [Math.random() * (this.size*0.9) + this.size*0.05, Math.random() * (this.size*0.9) + this.size*0.05];
			this.init = [Math.random() * (this.size*0.9) + this.size*0.05, Math.random() * (this.size*0.9) + this.size*0.05];
		}
	}

	draw_polygon(poly, colour) {
		this.ctx.fillStyle = colour;
		this.ctx.beginPath();
		this.ctx.moveTo(poly[0][0], poly[0][1]);
		for(let pos of poly)
			this.ctx.lineTo(pos[0], pos[1]);

		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.fillStyle = this.background;
	}

	draw_line(p, q, colour, width = 1) {
		this.ctx.strokeStyle = colour;
		this.ctx.lineWidth = width;
		this.ctx.beginPath();
		this.ctx.moveTo(p[0], p[1]);
		this.ctx.lineTo(q[0], q[1]);
		this.ctx.stroke();
		this.ctx.strokeStyle = this.background;
		this.ctx.lineWidth = 1;
	}

	draw(canvas) {
		this.ctx = canvas.getContext('2d');
		
		for (let obst of this.obstacles) {
			this.draw_polygon(obst, this.obst_colour);
		}

		this.ctx.fillStyle = this.init_colour;
		this.ctx.fillRect(this.init[0]-5, this.init[1]-5, this.size/64, this.size/64);
		this.ctx.fillStyle = this.goal_colour;
		this.ctx.fillRect(this.goal[0]-5, this.goal[1]-5, this.size/64, this.size/64);
		this.ctx.fillStyle = this.background;
	}

	update() {
		if(this.edges.length > 0) {
			let e = this.edges.pop();
			this.draw_line(e[0], e[1], this.edge_colour);
		} 
		else if(this.path.length > 1) {
			let v = this.path.shift(); //pop from the beginning;
			this.draw_line(v, this.path[0], this.path_colour, 5);
			this.draw_line(v, this.path[0], this.edge_colour);
		}
	}

	valid_obstacle(poly) {
		for (let ob of this.obstacles) {
			if(polygons_intersect(poly, ob)) {
				return false;
			}

			for (let v1 of poly) {
				for (let v2 of poly) {
					if(vertex_equals(v1, v2)) continue;
					if (Math.abs(v1[0] - v2[0]) < 5) return false;
					if (Math.abs(v1[1] - v2[1]) < 5) return false;
				}
				for (let v2 of ob) {
					if (Math.abs(v1[0] - v2[0]) < 5) return false;
					if (Math.abs(v1[1] - v2[1]) < 5) return false;
				}
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
			if (intersect_polygon([p,q], obs).length > 0)
				return false;
			if (inside_polygon([(p[0] + q[0])/2 ,(p[1] + q[1])/2], obs))
				return false;
		}
		return true;
	}
}
