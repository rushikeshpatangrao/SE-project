
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');

window.addEventListener("resize", function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context = canvas.getContext('2d');
   	redraw();
});

canvas.style.background = "white";
canvas.style.border = "1px solid black";
var paint;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var curr_color = "black";
var curr_width = 2;
var counter = 0;
var curr = 0;
var number_of_points = new Array();
var color_array = new Array();
var width_array = new Array();
var images = new Array();
var shape = null;
var eraser_size = null;
var eraser_continue = false;
var draw_image = false, image_resize = false;

//Color Adjustment
document.getElementById('black').addEventListener('click', function(e) {
	curr_color = "black";
	document.getElementById('Color').classList.add('invisible');
	document.getElementById('color').setAttribute("style", "background-color: black;");
});
document.getElementById('yellow').addEventListener('click', function(e) {
	curr_color = "yellow";
	document.getElementById('Color').classList.add('invisible');
	document.getElementById('color').setAttribute("style", "background-color: yellow;");
});

document.getElementById('green').addEventListener('click', function(e) {
	curr_color = "green";
	document.getElementById('Color').classList.add('invisible');
	document.getElementById('color').setAttribute("style", "background-color: green;");
});
document.getElementById('blue').addEventListener('click', function(e) {
	curr_color = "blue";
	document.getElementById('Color').classList.add('invisible');
	document.getElementById('color').setAttribute("style", "background-color: blue;");
});

document.getElementById('red').addEventListener('click', function(e) {
	curr_color = "red";
	document.getElementById('Color').classList.add('invisible');
	document.getElementById('color').setAttribute("style", "background-color: red;");
});

document.getElementById('purple').addEventListener('click', function(e) {
	curr_color = "purple";
	document.getElementById('Color').classList.add('invisible');
	document.getElementById('color').setAttribute("style", "background-color: purple;");
});

document.getElementById('color').addEventListener('click', function(e) {
	document.getElementById('Color').classList.remove('invisible');
	document.getElementById('color_name').classList.add('invisible');
});








//selecting color 
document.getElementById('DrawButton').addEventListener('click', function(e){
	document.getElementById('Draw').classList.add('invisible');
	document.getElementById('width').classList.remove('invisible');
	eraser_size = null;
});
document.getElementById('input_width').addEventListener('change', function(e) {
	document.getElementById('width').classList.add('invisible');
	curr_width = this.value;
});


//handling eraser
document.getElementById('FillButton').addEventListener('click', function(e){
	document.getElementById('Fill').classList.add('invisible');
	document.getElementById('FillColor').classList.remove('invisible');
});
document.getElementById('eraser_size').addEventListener('change', function(e) {
	document.getElementById('eraser').classList.add('invisible');
	eraser_size = this.value;
});


//Fill Color
document.getElementById('EraserButton').addEventListener('click', function(e){
	document.getElementById('Eraser').classList.add('invisible');
	document.getElementById('eraser').classList.remove('invisible');
});

document.getElementById('black1').addEventListener('click', function(e) {
	document.getElementById('canvas').setAttribute("style", "background-color: black;");
	document.getElementById('FillColor').classList.add('invisible');
});
document.getElementById('yellow1').addEventListener('click', function(e) {
	document.getElementById('canvas').setAttribute("style", "background-color: yellow;");
	document.getElementById('FillColor').classList.add('invisible');
	
});

document.getElementById('green1').addEventListener('click', function(e) {
	document.getElementById('canvas').setAttribute("style", "background-color: green;");
	document.getElementById('FillColor').classList.add('invisible');
	
});
document.getElementById('blue1').addEventListener('click', function(e) {
	document.getElementById('canvas').setAttribute("style", "background-color: blue;");
	document.getElementById('FillColor').classList.add('invisible');
	
});

document.getElementById('red1').addEventListener('click', function(e) {
	document.getElementById('canvas').setAttribute("style", "background-color: red;");
	document.getElementById('FillColor').classList.add('invisible');
	
});

document.getElementById('purple1').addEventListener('click', function(e) {
	document.getElementById('canvas').setAttribute("style", "background-color: purple;");
	document.getElementById('FillColor').classList.add('invisible');
	
});



//draw shapes
document.getElementById('ShapeButton').addEventListener('click', function(e){
	document.getElementById('Shape').classList.add('invisible');
	document.getElementById('ShapeSelect').classList.remove('invisible');
	eraser_size = null;
});
document.getElementById('rectangle').addEventListener('click', function(e) {
	document.getElementById('ShapeSelect').classList.add('invisible');
	shape = "rectangle";
});
document.getElementById('circle').addEventListener('click', function(e) {
	document.getElementById('ShapeSelect').classList.add('invisible');
	shape = "circle";
});
document.getElementById('vertical_triangle').addEventListener('click', function(e) {
	document.getElementById('ShapeSelect').classList.add('invisible');
	shape = "vertical_triangle";
});
document.getElementById('horizontal_triangle').addEventListener('click', function(e) {
	document.getElementById('ShapeSelect').classList.add('invisible');
	shape = "horizontal_triangle";
});


//Start new canvas


//

var startX = 0;
var startY = 0;
var draw=false;
var shapes = [];
var height, width, radius, point1X, point2X, point3X, point1Y, point2Y, point3Y;

function mouse_x_coord(e) {
	return e.pageX- canvas.offsetLeft;// - canvas.getBoundingClientRect().left-window.scrollX+226;
}
function mouse_y_coord(e) {
	return e.pageY- canvas.offsetTop - window.scrollY;// - canvas.getBoundingClientRect().top-window.scrolly+50;

}

//Undo button

function undo() {
	var points = number_of_points.pop();
	if(points == "shape") {
		shapes.pop();

	}
	else if(points == 'image') {
		images.pop();
	}
	else {
		for(var i=0; i<=points;i++) {
			clickX.pop();
			clickY.pop();
			clickDrag.pop();		
			color_array.pop();
			width_array.pop();
		} 
	}
	counter = 0;
	curr --;

	redraw();
}
document.getElementById('UndoButton').addEventListener('click', function(e) {
	undo();
})




//Drawing on the pane
function redraw() {

	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	context.strokeStyle = curr_color;
  	context.lineJoin = "round";
  	context.lineWidth = curr_width;

  	for(var i=0; i < images.length; i ++) {

  		context.drawImage(images[i].image, images[i].x, images[i].y, images[i].width, images[i].height); 
  	}

  	for(var i=0; i < clickX.length; i++) {	
    	context.beginPath();
    	context.strokeStyle = color_array[i];
    	context.lineWidth = width_array[i];
 
    	if(clickDrag[i] && i){
      		context.moveTo(clickX[i-1], clickY[i-1]);
     	}else{
       		context.moveTo(clickX[i]-1, clickY[i]);
     	}
     	context.lineTo(clickX[i], clickY[i]);
     	context.closePath();
     	context.stroke();
  }
  for(var i = 0; i < shapes.length; i ++) {
  	if(shapes[i].name == "circle") {
  		context.beginPath();
  		context.strokeStyle = shapes[i].color;
  		context.lineWidth = shapes[i].width;
    	context.arc(shapes[i].x, shapes[i].y, shapes[i].radius, 0, Math.PI * 2, true); 
    	context.stroke();
  	}
  	else if(shapes[i].name == "rectangle") {

  		context.strokeStyle = shapes[i].color;
  		context.lineWidth = shapes[i].width;
  		context.strokeRect(shapes[i].x, shapes[i].y, shapes[i].shape_width, shapes[i].height);

  	}
  	else if(shapes[i].name == "triangle") {
  		context.strokeStyle = shapes[i].color;
  		context.lineWidth = shapes[i].width;
  		context.beginPath();
		context.moveTo(shapes[i].point1X, shapes[i].point1Y);
    	context.lineTo(shapes[i].point2X, shapes[i].point2Y);
    	context.lineTo(shapes[i].point3X, shapes[i].point3Y);
    	context.lineTo(shapes[i].point1X, shapes[i].point1Y);
    	context.stroke();

  	}
  }
  // for(var i=0; i<images.length; i++) {
  // 	context.drawImage(images[i], 0, 0);
  // }

}


function addClick(x, y, dragging) {
	clickX.push(x);
  	clickY.push(y);
  	clickDrag.push(dragging);
  	color_array.push(curr_color);
	width_array.push(curr_width);

}


canvas.addEventListener("mousedown", function(e) {

	if(draw_image) {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		var file = document.getElementById('selectedFile').files[0];
		var fr = new FileReader();
		var img;
		var image_container = {};
		fr.onload = function() {
			img = new Image();
			img.onload = function() {
				draw_image = false;
				redraw();
				context.drawImage(img, mouse_x_coord(e), mouse_y_coord(e), 100, 100);

				
				image_container.image = img;
				image_container.x = mouse_x_coord(e);
				image_container.y = mouse_y_coord(e);
				image_container.width = 100;
				image_container.height = 100;
				images.push(image_container);
				number_of_points[curr] = "image";
				curr ++;
				image_resize = true;
				// shapes.push({name:"rectangle",
				// 				x: mouse_x_coord(e),
				// 				y: mouse_y_coord(e),
				// 				shape_width: 100,
				// 				height: 100,
				// 				color:"black",
				// 				width:2});

		}
		img.src = fr.result;
		
		}
		if(file) {
			fr.readAsDataURL(file); 

		}	
	}


	else if(shape) { //for drawing shapes
		startX = mouse_x_coord(e);
		
		startY = mouse_y_coord(e);
		draw=true;
	}
	// else if(eraser_size) {
	// 	context.fillStyle = canvas.style.backgroundColor;
		
	// 	var x = mouse_x_coord(e) - eraser_size/2;
	// 	var y = mouse_y_coord(e) - eraser_size/2
	// 	context.fillRect(x, y, eraser_size,  eraser_size);
	// 	//number_of_points.push("eraser");
	// 	eraser_continue = true;
	// }
	else {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		paint = true;
		number_of_points[curr] = 1;
		addClick(mouse_x_coord(e), mouse_y_coord(e), false);

		redraw();
	}

});

canvas.addEventListener("mousemove", function(e) {
	if(image_resize) {
		
		var curr_image = images.pop();
		context.drawImage(curr_image.image, curr_image.x, curr_image.y, mouse_x_coord(e) - curr_image.x, mouse_y_coord(e)-curr_image.y);
		// shapes.pop();
		// shapes.push({name:"rectangle",
		// 		x:curr_image.x,y:curr_image.y,
		// 		shape_width:mouse_x_coord(e) - curr_image.x,
		// 		height:mouse_y_coord(e) - curr_image.y,
		// 		color:"black",
		// 		width:2});
		curr_image.width = mouse_x_coord(e) - curr_image.x;
		curr_image.height = mouse_y_coord(e) - curr_image.y;
		images.push(curr_image);
		redraw(); 
	}
	else if(shape) { //for drawing shapes
			if(draw) {
				
				if(shape == "rectangle") {
					redraw();
					context.strokeStyle = curr_color;
					context.lineWidth = curr_width;
					context.strokeRect(startX, startY, mouse_x_coord(e) - startX, mouse_y_coord(e) - startY);
					height =mouse_y_coord(e) - startY;
					width = mouse_x_coord(e) - startX; 

				}
				else if(shape == "circle") {
					redraw();
					context.beginPath();
					context.strokeStyle = curr_color;
					context.lineWidth = curr_width;
    				context.arc(startX, startY, Math.max(Math.abs(mouse_x_coord(e)-startX), Math.abs(mouse_y_coord(e)-startY)), 0, Math.PI * 2, true); 
    				context.stroke();
    				radius = Math.max(Math.abs(mouse_x_coord(e)-startX), Math.abs(mouse_y_coord(e)-startY));
				}
				else if(shape == "vertical_triangle") {
					redraw();
					context.beginPath();
					context.strokeStyle = curr_color;
					context.lineWidth = curr_width;
					context.moveTo(startX, startY);
    				context.lineTo(mouse_x_coord(e), mouse_y_coord(e));
    				context.lineTo(2*startX - mouse_x_coord(e), mouse_y_coord(e));
    				context.lineTo(startX, startY);
    				context.stroke();
    				point1X = startX;
    				point1Y = startY;
    				point2X = mouse_x_coord(e);
    				point2Y = mouse_y_coord(e);
    				point3X = 2*startX - mouse_x_coord(e);
    				point3Y = mouse_y_coord(e);

				}
				else if(shape = "horizontal_triangle") {
					redraw();
					context.beginPath();
					context.strokeStyle = curr_color;
					context.lineWidth = curr_width;
					context.moveTo(startX, startY);
    				context.lineTo(mouse_x_coord(e), mouse_y_coord(e));
    				context.lineTo(mouse_x_coord(e), 2*startY - mouse_y_coord(e));
    				context.lineTo(startX, startY);
    				context.stroke();
    				point1X = startX;
    				point1Y = startY;
    				point2X = mouse_x_coord(e);
    				point2Y = mouse_y_coord(e);
    				point3X = mouse_x_coord(e);
    				point3Y = 2*startY - mouse_y_coord(e);
				}
			}
	}
	// else if(eraser_continue) {
	// 	context.fillStyle = canvas.style.backgroundColor;
	// 	var x = mouse_x_coord(e) - eraser_size/2;
	// 	var y = mouse_y_coord(e) - eraser_size/2
	// 	context.fillRect(x, y, eraser_size,  eraser_size);
	// 	//number_of_points.push("eraser");
	// }
	else {
		if(paint) {
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
			addClick(mouse_x_coord(e), mouse_y_coord(e), true);
		
			counter ++;
			number_of_points[curr] = counter;

			redraw();
		}
	}

});

canvas.addEventListener("mouseup", function(e) {
	if(image_resize) {
		image_resize = false;
		// shapes.pop();
		
	}
	else if(shape) {
		if(shape == "circle") {
			shapes.push({name:"circle",x:startX,y:startY,radius:radius,color:curr_color,width:curr_width});
		}
		else if(shape == "rectangle") {
			shapes.push({name:"rectangle",x:startX,y:startY,shape_width:width,height:height,color:curr_color,width:curr_width});
		}
		else if(shape == "vertical_triangle" || shape == "horizontal_triangle") {
			shapes.push({name:"triangle",
				point1X:point1X,point1Y:point1Y,point2X:point2X,point2Y:point2Y,point3X:point3X,point3Y:point3Y,
				color:curr_color,width:curr_width});
		}
		curr --;
		number_of_points[curr] = "shape";
		curr ++;
		draw = false;
		shape = null;
	}
	// else if(eraser_continue) {
	// 	eraser_continue = false;
	// }
	else {
		curr ++;
		counter = 0;
		paint = false;		
	}
	console.log(number_of_points);

});


canvas.addEventListener("mouseleave", function(e) {
	if(image_resize) {
		image_resize = false;
		// shapes.pop();
	}
	else if(shape) {
		if(shape == "circle") {
			shapes.push({name:"circle",x:startX,y:startY,radius:radius,color:curr_color,width:curr_width});
		}
		else if(shape == "rectangle") {
			shapes.push({name:"rectangle",x:startX,y:startY,shape_width:width,height:height,color:curr_color,width:curr_width});
		}
		else if(shape == "vertical_triangle" || shape == "horizontal_triangle") {
			shapes.push({name:"triangle",
				point1X:point1X,point1Y:point1Y,point2X:point2X,point2Y:point2Y,point3X:point3X,point3Y:point3Y,
				color:curr_color,width:curr_width});
		}
		curr --;
		number_of_points[curr] = "shape";
		curr ++;

		draw = false;
		shape = null;
	}
	// else if(eraser_continue) {
	// 	eraser_continue = false;
	// }
	else {
		curr ++;
		counter = 0;
		paint = false;
	}

});


//adding drawn image
document.getElementById('selectedFile').addEventListener("change", function() {
	draw_image = true;


});



function download(){
    document.getElementById("downloader").download = "image.png";
    document.getElementById("downloader").href = document.getElementById("canvas").toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}