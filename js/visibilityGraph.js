class VisibilityGraph {
	constructor(env) {
		this.env = env;
		this.iteration = 0;
		this.current_pos = this.env.init;
		this.status = "";
		
		this.vertices = this.compute_vertices();

		this.edges = this.compute_edges();
		this.env.edges = Array.from(this.edges);

		this.path = this.find_path();
		this.env.path = Array.from(this.path);
	}

	lessVertex(v, w) {
		if(v[0] < w[0]) return true;
		if(v[0] > w[0]) return false;
		return (v[1] < w[1]);
	}

	step() {
		if(this.iteration >= this.edges.length + this.path.length -2)
			return true;
		++this.iteration;
		return false;
	}

	compute_vertices() {
		let vertices = [this.env.init, this.env.goal];
		for(let obst of this.env.obstacles) {
			for(let v of obst) {
				vertices.push(v);
			}
		}
		return vertices;
	}

	compute_edges() {
		let edges = [];
		for(let v of this.vertices) {
			for(let w of this.vertices) {
				if(this.lessVertex(v, w) && this.env.visible(v,w)) /* So each pair is evaluated only once */ {
					edges.push([v,w]);
				}
			}
		}
		return edges;
	}

	find_path() {
		let closed_set = [];
		let open_set = [[this.env.init, 0]];

		let came_from = {};
		while (open_set.length > 0) {
			// current := the node in open_set having the lowest f value
			let current = open_set[0];   /* current shape: [vertex, g_score] */
			let current_i = 0;

			for (let i = 0; i < open_set.length; ++i) {
				/* compare f_scores */
				if ( (open_set[i][1] + euclidean_distance(open_set[i][0], this.env.goal)) 
					 < (current[1] + euclidean_distance(current[0], this.env.goal)) ) {
					current = open_set[i]; /* shape [vertex, g_score] */
					current_i = i;
				}
			}

			if (vertex_equals(current[0], this.env.goal)) {
				this.path_length = current[1];
				return this.reconstruct_path(came_from, current[0]);
			}

			open_set.splice(current_i, 1);
			closed_set.push(current);

			for(let neighbour of this.get_neibours(current[0])) {
				if( this.vertex_in_set(neighbour, closed_set) > -1) {
					continue; // Ignore the neighbour which is already evaluated.
				}

				// The distance from start to the neighbour
				let tentative_g = current[1] + euclidean_distance(current[0], neighbour);

				let n_open_idx = this.vertex_in_set(neighbour, open_set);
				if( n_open_idx < 0 ) /* Discover a new node */ {
					open_set.push([neighbour, tentative_g]);
				}
				else if ( tentative_g >= open_set[n_open_idx][1]) {
					continue;
				}

				// This path is the best until now. Record it!
				// neighbour shape: vertex
				// current shape:[vertex, g_score]
				came_from[neighbour] = current[0];
			}
		}
	}

	reconstruct_path(came_from, current) {
		let path = [];
		path.push(current);

		while( ! vertex_equals(current, this.env.init)) {
			current = came_from[current];
			path.push(current);
		}
		this.status = "Path found. Path length: " + this.path_length.toFixed(2);
		return path;
	}

	get_neibours(vertex) {
		let neighbours = [];
		for (let e of this.edges) {
			// edge e1-e2.
			let e1 = e[0];
			let e2 = e[1];
			if(vertex_equals(e1,vertex)) {
				neighbours.push(e2);
			}
			else if(vertex_equals(e2, vertex)) {
				neighbours.push(e1);
			}
		}
		return neighbours;
	}

	vertex_in_set(vertex, set) {
		for (let i = 0; i < set.length; ++i) {
			let set_i_v = set[i][0];
			if(vertex_equals(vertex, set_i_v))
				return i;
		}
		return -1;
	}

	get_vertex_idx(vertex) {
		for (let i = 0; i < this.vertices.length; ++i) {
			v_i = this.vertices[i];
			if(vertex_equals(vi, vertex)) {
				return i
			}
		}
		return -1
	}
}