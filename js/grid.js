class Grid {
	constructor(size, res, num_obst, max_obst_size) {
		this.size = size;
		this.res = res;
		this.num_obst = num_obst;
		this.max_obst_size = max_obst_size;
		this.path = [];
		this.update_cells = [];
		this.obst_colour = "rgba(170, 170, 170, 0.95)";
		this.goal_colour = "rgba(  0,  80, 180, 0.8)";
		this.init_colour = "rgba(230,  30, 100, 0.8)";
		this.path_colour = "rgba(255, 235,  60, 0.7)";
		this.background  = "rgba(255, 255, 255,    0)";

		this.values = [];
		for(let i = 0; i < this.res; ++i) {
			this.values[i] = new Array(this.res).fill(0)
		}

		this.generate_obstacles();

		this.goal = [0, 0]
		this.init = [0, 0]

		while(this.distance(this.goal, this.init) < res 
			|| this.get_value(this.goal) == 1 || this.get_value(this.init) == 1) {
			this.goal = [Math.floor(Math.random()*this.res), Math.floor(Math.random()*this.res)];
			this.init = [Math.floor(Math.random()*this.res), Math.floor(Math.random()*this.res)];
		}
	}

	distance(cell1, cell2) {
		return Math.abs(cell1[0] - cell2[0]) + Math.abs(cell1[1] - cell2[1]);
	}

	generate_obstacles() {
		this.obstacles = new Array();

		for(let i = 0; i < this.num_obst; ++i) {
			// randomly choose original position
			let x = Math.floor(Math.random()*this.res);
			let y = Math.floor(Math.random()*this.res);
			if(this.get_value([x, y]) == 1) {
				--i;
				continue;
			}
			this.set_value([x,y], 1);
			this.obstacles.push([x,y]);

			for(let j = 0; j < this.max_obst_size-1; ++j) {

				// randomly pick direction
				let dir = Math.floor(Math.random()*4);
				switch (dir) {
					case 0:
					if (x < this.res-1 && this.values[x+1][y] == 0) {
						this.values[++x][y] = 1;
						break;
					}
					case 1:
					if (x > 0 && this.values[x-1][y] == 0) {
						this.values[--x][y] = 1;
						break;
					}
					case 2:
					if (y < this.res-1 && this.values[x][y+1] == 0) {
						this.values[x][++y] = 1;
						break;
					}
					case 3:
					if (y > 0 && this.values[x][y-1] == 0) {
						this.values[x][--y] = 1;
						break;
					}
				}
				this.obstacles.push([x,y]);
			}
		}
	}

	clear_cell(cell) {
		let x = cell[0];
		let y = cell[1];
		this.ctx.clearRect((x + 0.05)*this.cell_size, (y+0.05)*this.cell_size, 0.9*this.cell_size, 0.9*this.cell_size);
	}

	colour_cell(cell, colour) {
		let x = cell[0];
		let y = cell[1];
		this.ctx.fillStyle = colour;
		this.ctx.fillRect(x*this.cell_size, y*this.cell_size, this.cell_size, this.cell_size);
		this.ctx.fillStyle = this.background;
	}

	write_cell(cell, text) {
		let x = cell[0];
		let y = cell[1];
		this.ctx.fillStyle = "black";
		this.ctx.font = (this.cell_size/2).toString() + "px Arial";
		this.ctx.textAlign="center"; 
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(text, (x+.5)*this.cell_size, (y+.5)*this.cell_size);
		this.ctx.fillStyle = this.background;
	}

	draw(canvas) {
		this.cell_size = this.size/this.res
		canvas.style.border = (this.size/64).toString() + "px solid " + this.obst_colour;
		
		this.ctx = canvas.getContext("2d");
		// Background colour
		this.ctx.fillStyle = this.background;

		// Draw grid:
		for(let i = 0; i <= this.res; ++i) {
				this.ctx.moveTo(i*this.cell_size,0);
				this.ctx.lineTo(i*this.cell_size,this.size);
				this.ctx.stroke();
				this.ctx.moveTo(0, i*this.cell_size);
				this.ctx.lineTo(this.size, i*this.cell_size);
				this.ctx.stroke();
			}

		// Draw obstacles:
		for(let x = 0; x < this.res; ++x) {
			for(let y = 0; y < this.res; ++y) {
				if(this.values[x][y] == 1) {
					this.colour_cell([x,y], this.obst_colour)
					this.write_cell([x,y], "1")
				}
			}
		}

		// Draw path:
		for(let c of this.path) {
			this.colour_cell(c, this.path_colour)
		}
		this.drawn_path = this.path.slice();

		// Colour goal and init
		this.colour_cell(this.goal, this.goal_colour);
		this.colour_cell(this.init, this.init_colour);

		// Write cell values
		for(let x = 0; x < this.res; ++x) {
			for(let y = 0; y < this.res; ++y) {
				if(this.values[x][y] > 0) {
					this.write_cell([x, y], this.values[x][y].toString());
				}
			}
		}

		this.update_cells = [];
	}

	update() {
		while(this.update_cells.length > 0) {
			let c = this.update_cells.pop();
			this.clear_cell(c);

			// if goal or init are updated, they must be coloured again.
			if(c[0] == this.goal[0] && c[1] == this.goal[1]) {
				this.colour_cell(c, this.goal_colour);
			}
			if(c[0] == this.init[0] && c[1] == this.init[1]) {
				this.colour_cell(c, this.init_colour);
			}
			// if the cell is from the path, it must be coloured and its value written.
			if(this.path.includes(c)) {
				this.colour_cell(c, this.path_colour);
			}
			if(this.get_value(c) > 0) {
				this.write_cell(c, this.get_value(c).toString());
			}
		}
	}

	clean(canvas) {
		let ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, this.size, this.size);
	}

	get_neighbours(cell) {
		let neighbours = []
		let x = cell[0];
		let y = cell[1];
		
		if (x < this.res-1)  neighbours.push([x+1,y]);
		if (x > 0)           neighbours.push([x-1,y]);
		if (y < this.res-1)  neighbours.push([x,y+1]);
		if (y > 0)           neighbours.push([x,y-1]);

		return neighbours
	}

	get_value(cell) {
		return this.values[cell[0]][cell[1]];
	}

	set_value(cell, value) {
		this.values[cell[0]][cell[1]] = value;
		this.update_cells.push(cell);
	}

	max_value_cell(cells) {
		let max_cell = cells[Math.floor(Math.random() * cells.length)];
		let max_value = this.get_value(max_cell);
		for(let c of cells) {
			let val = this.get_value(c);
			if (val > max_value) {
				max_cell = c;
				max_value = val;
			}
		}
		return max_cell;
	}
}