let timerId;
let play = false;
let step_count = 0;
let done = false;

function step_button(grid, planning, canvas, info) {
	if (done) return;
	++step_count;
	if (step_count == 1) {
		info.innerHTML += "Step: 1 ";
	} else {
		info.innerHTML += step_count.toString() + " ";
	}
	let planning_done = planning.step();

	grid.update();
	
	if(planning_done) {
		document.getElementById("playButton").value = "Play";
		info.innerHTML += "<p>Done!</p>"
		clearInterval(timerId);
		done = true;
		play = false;
	}
}

function play_button(grid, planning, canvas, info) {
	if(done) return;
	if(!play) {
		document.getElementById("playButton").value = "Stop";
		play = true;
		timerId = setInterval(step_button, 200, grid, planning, canvas, info);
	} else {
		document.getElementById("playButton").value = "Play";
		clearInterval(timerId);
		play = false;
	}
	
}