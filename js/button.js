let timer_id;
let play = false;
let step_count = 0;
let done = false;
let paragraph;
let current_line_length;

function step_button(grid, planning, canvas, info) {
	if (done) return;
	++step_count;
	if (step_count == 1) {
		paragraph = document.createElement("p");
		info.appendChild(paragraph);
		current_line_length = 0;
		let new_text = "Step: 1 ";
		paragraph.innerHTML += new_text;
		current_line_length += new_text.length;
	}
	else {
		let new_text = step_count.toString() + " ";
		paragraph.innerHTML += new_text;
		current_line_length += new_text.length;
	}
	let planning_done = planning.step();

	grid.update();
	
	if(planning_done) {
		document.getElementById("playButton").value = "Play";
		document.getElementById("playButton").disabled = true;
		document.getElementById("stepButton").disabled = true;
		//info.innerHTML += "<p>Done.</p>"
		info.innerHTML += "<p>" + planning.status + "</p>";
		clearInterval(timer_id);
		done = true;
		play = false;
	}
}

function play_button(grid, planning, canvas, info) {
	if(done) return;
	if(!play) {
		document.getElementById("playButton").value = "Stop";
		play = true;
		timer_id = setInterval(step_button, 200, grid, planning, canvas, info);
	} else {
		document.getElementById("playButton").value = "Play";
		clearInterval(timer_id);
		play = false;
	}
	
}

function refresh_button() {
	location.reload();
}