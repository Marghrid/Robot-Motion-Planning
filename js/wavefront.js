class Wavefront {
	constructor(grid) {
		this.grid = grid;
		this.border = [this.grid.goal];
		this.grid.set_value(this.grid.goal, 2);
		this.iteration = 2;
		this.current_pos = this.grid.init;

		this.attractive = false;
		this.path = false;
	}

	step() {
		if (!this.attractive) {
			this.step_attractive();
			return false;
		} 
		else if (!this.path) {
			this.step_path();
			return false;
		}
		return true;
	}

	step_attractive() {
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

		if (new_border.length == 0) {
			this.attractive = true;
			this.iteration = this.grid.get_value(this.grid.init);
			return;
		}
		this.border = new_border.slice();
		++this.iteration;
	}

	step_path() {
		let neighbours = this.grid.get_neighbours(this.current_pos);
		let next;
		for (let n of neighbours) {
			if(this.grid.get_value(n) == this.iteration-1) {
				next = n;
				break;
			}
		}
		
		if (next[0] == this.grid.goal[0] && next[1] == this.grid.goal[1]) {
			this.current_pos = this.goal;
			this.path = true;
			console.log("DONE");
			return;
		}

		this.current_pos = next;
		this.grid.path.push(this.current_pos);
		this.grid.update_cells.push(this.current_pos);
		--this.iteration;
	}
}