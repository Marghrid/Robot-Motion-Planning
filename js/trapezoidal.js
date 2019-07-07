class Trapezoid {
	constructor(env) {
		this.env = env;
		this.path = false;
		this.status = "";
	}

	step() {
		if(this.path) return true;
		for (let obst of this.env.obstacles) {
			for (let v of obst) {
				if(inside_polygon([v[0], v[1]-1], obst, this.env.size))
					continue;
				
				let seg_up = [v, [v[0], 0]];// upper vertical extension;
				
				for (let obst of this.env.obstacles) {
					let intersection_point = intersect_polygon(seg_up, obst);
					while (intersection_point.length > 0) {
						seg_up = [v, [intersection_point[0], intersection_point[1] + 1]];
						intersection_point = intersect_polygon(seg_up, obst);
					}
				}
				this.env.draw_line(seg_up[0], seg_up[1], "#ee0000");
			}

			for (let v of obst) {
				if(inside_polygon([v[0], v[1]+1], obst, this.env.size))
					continue;
				
				let seg_down = [v, [v[0], this.env.size]]; // lower vertical extension;

				for (let obst of this.env.obstacles) {
					let intersection_point = intersect_polygon(seg_down, obst);
					while (intersection_point.length > 0) {
						seg_down = [v, [intersection_point[0], intersection_point[1] - 1]];
						intersection_point = intersect_polygon(seg_down, obst);
					}
				}
				this.env.draw_line(seg_down[0], seg_down[1], "#00aa44");
			}
		}
		this.path = true;
	}
}