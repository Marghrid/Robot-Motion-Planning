class VisibilityGraph {
	constructor(env) {
		this.env = env;
		this.vertices = [this.env.init, this.env.goal];
		this.iteration = 0;
		for(let obst of this.env.obstacles) {
			for(let v of obst) {
				this.vertices.push(v);
			}
		}

		this.edges = [];
		for(let v of this.vertices) {
			for(let w of this.vertices) {
				if(this.lessVertex(v, w)) {
					if(this.env.visible(v,w)) {
						this.edges.push([v,w]);
					}
				}
			}
		}
	}

	lessVertex(v, w) {
		if(v[0] < w[0]) return true;
		if(v[0] > w[0]) return false;
		return (v[1] < w[1]);
	}

	step() {
		if(this.iteration >= this.edges.length)
			return true;
		console.log(this.iteration);

		let e = this.edges[this.iteration];
		this.env.update_edges.push(e);

		++this.iteration;

		if(this.iteration >= this.edges.length)
			return true;
		return false;
	}
}