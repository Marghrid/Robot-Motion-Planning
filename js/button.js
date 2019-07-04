let timerId;
let play = false;
let step_count = 0;

function step_button(grid, planning, canvas, info) {
	++step_count;
	if (step_count == 1) {
		info.innerHTML += "Step: 1 ";
	} else {
		info.innerHTML += step_count.toString() + " ";
	}
	let done = planning.step();

	grid.update();
	
	if(done) {
		document.getElementById("playButton").value = "Play";
		info.innerHTML += "<p>Done!</p>"
		clearInterval(timerId);
		play = false;
	}
}

function play_button(grid, planning, canvas, info) {
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