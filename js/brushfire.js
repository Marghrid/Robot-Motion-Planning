class Brushfire {
	constructor(grid) {
		this.grid = grid;
		this.iteration = 1;
		this.border = this.grid.obstacles;
		this.current_pos = this.grid.init;

		this.repulsive = false;
		this.attractive = false;
		this.path = false;
		this.status = "";
	}

	step() {
		if (!this.repulsive) {
			this.step_repulsive();
			return false;
		} 
		else if (!this.attractive) {
			this.step_attractive();
			return false;
		}
		else if (!this.path) {
			this.step_path();
			return false;
		}
		return true;
	}

	step_repulsive() {
		let new_border = new Array();
		for (let cell of this.border) {
			let neighbours = this.grid.get_neighbours(cell);
			for (let n of neighbours) {
				if(this.grid.get_value(n) == 0) {
					this.grid.set_value(n,this.iteration+1);
					new_border.push(n)
				}
			}
		}

		if(this.iteration == 1) {
			for(let i = 0; i < this.grid.res; ++i) {
				if(this.grid.get_value([0, i]) == 0) {
					this.grid.set_value([0, i], 2);
					new_border.push([0, i]);
				}
				if(this.grid.get_value([i, 0]) == 0) {
					this.grid.set_value([i, 0], 2);
					new_border.push([i, 0]);
				}
				if(this.grid.get_value([this.grid.res-1, i]) == 0) {
					this.grid.set_value([this.grid.res-1, i], 2);
					new_border.push([this.grid.res-1, i]);
				}
				if(this.grid.get_value([i, this.grid.res-1]) == 0) {
					this.grid.set_value([i, this.grid.res-1], 2);
					new_border.push([i, this.grid.res-1]);
				}
			}
		}

		if (new_border.length == 0) {
			this.repulsive = true;
		}
		this.border = new_border.slice();
		++this.iteration;
	}

	step_attractive() {
		for (let x = 0; x < this.grid.res; ++x) {
			for (let y = 0; y < this.grid.res; ++y) {
				if (this.grid.get_value([x,y]) != 1) {
					let new_val = this.grid.get_value([x,y]) + 2*res - this.grid.distance([x, y], this.grid.goal);
					this.grid.set_value([x,y], new_val);
				}
			}
		}

		this.attractive = true;
	}

	step_path() {
		if(this.iteration > this.grid.res*4) {
			console.log("timeout :(");
			this.path = true;
			this.status = "Timeout. Stuck at a local minimum. No path found.";
		}
		let neighbours = this.grid.get_neighbours(this.current_pos);

		for (let n of neighbours) {
		}

		let next = this.grid.max_value_cell(neighbours);
		if (next[0] == this.grid.goal[0] && next[1] == this.grid.goal[1]) {
			this.current_pos = this.goal;
			console.log("Done :)");
			this.path = true;
			this.status = "Path found. Length: " + (this.grid.path.length + 1).toString();
			return;
		}
		if (this.grid.get_value(next) < this.grid.get_value(this.current_pos)) {
			console.log("Local minimum :(");
			this.path = true;
			this.status = "Stuck at a local minimum. No path found.";
			return;
		}
		this.current_pos = next;
		this.grid.path.push(this.current_pos);
		this.grid.update_cells.push(this.current_pos);

	}
}