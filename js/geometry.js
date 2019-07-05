// Given three colinear points p, q, r, the function checks if 
// point q lies on line segment 'pr' 	
function onSegment(p, q, r) { 
	if (q[0] <= Math.max(p[0], r[0])  &&  q[0] >= Math.min(p[0], r[0]) && 
		q[1] <= Math.max(p[1], r[1])  &&  q[1] >= Math.min(p[1], r[1])) 
		return true; 

	return false; 
}

// To find orientation of ordered triplet (p, q, r). 
// The function returns following values 
// 0 --> p, q and r are colinear 
// 1 --> Clockwise 
// 2 --> Counterclockwise 
function orientation(p, q, r) { 
	// See https://www.geeksforgeeks.org/orientation-3-ordered-points/ 
	// for details of below formula. 
	let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]); 

	if (val == 0) return 0;  // colinear 

	return (val > 0)? 1: 2; // clock or counterclock wise 
} 

// The main function that returns true if line segment 'p1q1' 
// and 'p2q2' intersect. 
function line_segments_intersect(p1, q1, p2, q2) { 
	// Find the four orientations needed for general and 
	// special cases 
	let o1 = orientation(p1, q1, p2); 
	let o2 = orientation(p1, q1, q2); 
	let o3 = orientation(p2, q2, p1); 
	let o4 = orientation(p2, q2, q1); 

	// General case 
	if (o1 != o2 && o3 != o4) 
		return true; 

	// Special Cases 
	// p1, q1 and p2 are colinear and p2 lies on segment p1q1 
	if (o1 == 0 && onSegment(p1, p2, q1)) return true;
	// p1, q1 and q2 are colinear and q2 lies on segment p1q1 
	if (o2 == 0 && onSegment(p1, q2, q1)) return true;
	// p2, q2 and p1 are colinear and p1 lies on segment p2q2 
	if (o3 == 0 && onSegment(p2, p1, q2)) return true;
	 // p2, q2 and q1 are colinear and q1 lies on segment p2q2 
	 if (o4 == 0 && onSegment(p2, q1, q2)) return true;

	return false; // Doesn't fall in any of the above cases 
}


// The main function that returns true if line segment 'p1q1' 
// and 'p2q2' intersect. 
function line_segments_intersect2(p1, q1, p2, q2) { 
	// Find the four orientations needed for general and 
	// special cases 
	let o1 = orientation(p1, q1, p2); 
	let o2 = orientation(p1, q1, q2); 
	let o3 = orientation(p2, q2, p1); 
	let o4 = orientation(p2, q2, q1); 

	if (o1 != o2 && o3 != o4) 
		return true;

	return false;
}

function lines_intersection(p1, p2, p3, p4) {
	x1 = p1[0];
	y1 = p1[1];
	x2 = p2[0];
	y2 = p2[1];
	x3 = p3[0];
	y3 = p3[1];
	x4 = p4[0];
	y4 = p4[1];

	x12 = x1-x2;
	x13 = x1-x3;
	x34 = x3-x4;
	y12 = y1-y2;
	y13 = y1-y3;
	y34 = y3-y4;

	den = x12*y34 - x34*y12;

	if(den == 0)
		return [-1,-1];

	ta = (y34*x13 - x34*y13)/den;
	tb = (y12*x13 - x12*y13)/den;

	return [x1+ta*(x2-x1), y1+ta*(y2-y1)];
}

function line_segments_intersect3(p1, p2, p3, p4) { 
	x1 = p1[0];
	y1 = p1[1];
	x2 = p2[0];
	y2 = p2[1];
	x3 = p3[0];
	y3 = p3[1];
	x4 = p4[0];
	y4 = p4[1];

	x12 = x1-x2;
	x13 = x1-x3;
	x34 = x3-x4;
	y12 = y1-y2;
	y13 = y1-y3;
	y34 = y3-y4;

	den = x12*y34 - x34*y12;

	if(den == 0)
		return [-1,-1];

	ta = (y34*x13 - x34*y13)/den;
	tb = (y12*x13 - x12*y13)/den;

	return ta > 0 && ta < 1 && tb > 0 && tb < 1;
}

function polygons_intersect(p, q) {
	for(let i = 0; i < p.length; ++i) {
		for(let j = 0; j < q.length; ++j) {
			if (line_segments_intersect(p[i], p[(i+1)%p.length],q[j], q[(j+1)%q.length])) {
				return true;
			}
		}
	}

	for(let e of p) {
		for(let f of q) {
			if (line_segments_intersect(e[0], e[1],f[0], f[1])) {
				return true;
			}
		}
	}

	return false;
}

// Returns true if the point p lies inside the polygon[] with n vertices 
function inside_polygon(p, polygon, infinite) 
{ 
    // There must be at least 3 vertices in polygon[] 
    if (polygon.length < 3)  return false; 
  
    // Create a point for line segment from p to infinite 
    let extreme = [1024, p[1]]; 
  
    // Count intersections of the above line with sides of polygon 
    let count = 0;
    let i = 0; 
    do { 
        let next = (i+1)%polygon.length; 
  
        // Check if the line segment from 'p' to 'extreme' intersects 
        // with the line segment from 'polygon[i]' to 'polygon[next]' 
        if (line_segments_intersect(polygon[i], polygon[next], p, extreme)) { 
            // If the point 'p' is colinear with line segment 'i-next', 
            // then check if it lies on segment. If it lies, return true, 
            // otherwise false 
            if (orientation(polygon[i], p, polygon[next]) == 0) 
               return false;
  
            ++count; 
        } 
        i = next; 
    } while (i != 0); 
  
    // Return true if count is odd, false otherwise
    return count%2 == 1;
} 

function generatePolygon( ctrX, ctrY, aveRadius, irregularity, spikeyness, numVerts ) {
	irregularity = irregularity * 2*Math.PI / numVerts;
	spikeyness = spikeyness * aveRadius;

	//generate n angle steps
	let angleSteps = [];
	let lower = (2*Math.PI / numVerts) - irregularity;
	let upper = (2*Math.PI / numVerts) + irregularity;

	let sum = 0;
	for (let i = 0; i < numVerts; ++i) {
		let tmp = Math.random() * (upper - lower) + lower;
		angleSteps.push( tmp );
		sum = sum + tmp;
	}

	// normalize the steps so that point 0 and point n+1 are the same
	let k = sum / (2*Math.PI);
	for (let i = 0; i < numVerts; ++i) {
		angleSteps[i] = angleSteps[i] / k;
	}

	// now generate the points
	let points = [];
	let angle = Math.random() * 2*Math.PI;
	for (let i = 0; i < numVerts; ++i) {
		let lower = aveRadius - spikeyness*aveRadius;
		let upper = aveRadius + spikeyness*aveRadius;
		let rand1 = Math.random() * (upper - lower) + lower;
		let rand2 = Math.random() * (upper - lower) + lower;
		let r_i  = (rand1 + rand2) / 2; 

		let x = ctrX + r_i*Math.cos(angle);
		let y = ctrY + r_i*Math.sin(angle);
		points.push( [Math.round(x),Math.round(y)] );

		angle = angle + angleSteps[i];
	}
	return points;
}

function intersect_polygon(r, poly) {
	let i = 0; 
    do { 
        let next = (i+1)%poly.length; 
  
        // Check if the line segment from 'p' to 'extreme' intersects 
        // with the line segment from 'poly[i]' to 'poly[next]' 
        if((r[0] == poly[i] && r[1] == poly[next]) || (r[1] == poly[i] && r[0] == poly[next])) {
        	return false;
        }
        if (line_segments_intersect3(poly[i], poly[next], r[0], r[1])) { 
            return true;
        } 
        i = next; 
    } while (i != 0);
    return false;
}

function euclidean_distance(p, q) {
	let a = p[0] - q[0];
	let b = p[1] - q[1];
	return Math.sqrt( a*a + b*b );
}
