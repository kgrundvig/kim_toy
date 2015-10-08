var pi = Math.PI;
var tau = pi * 2;
var deg = tau / 360;
var canvas = document.getElementById('kim_toy');
var context = canvas.getContext('2d');
var height = canvas.height;
var width = canvas.width;
var halfHeight = Math.round(height / 2);
var halfWidth = Math.round(width / 2);
var hslaString = function(h, s, l, a){
	return 'hsla('+ ((h % 1) * 360) +', '+ (s * 100) +'%, '+ (l * 100) +'%, '+ (a) +')';
};
var drawCircle = function(v, radius, color, lineWidth){
	var context = this.context;
	context.save();
	context.translate(v[0], v[1]);
	context.fillStyle = color || '#f00';
	context.lineWidth = lineWidth || 1;
	context.beginPath();
	context.arc(0, 0, radius, 0, tau);
	context.fill();
	context.restore();
};
var drawLine = function(v1, v2, color, lineWidth){
	var context = this.context;
	context.save();
	context.strokeStyle = color || '#f00';
	context.lineWidth = lineWidth || 1;
	context.beginPath();
	context.moveTo(v1[0], v1[1]);
	context.lineTo(v2[0], v2[1]);
	context.stroke();
	context.restore();
};
var rotate = function(out, a, rad){
	var angle = Math.atan2(a[1], a[0]) + rad;
	var length = vec2.length(a);
	out[0] = Math.cos(angle) * length;
	out[1] = Math.sin(angle) * length;
	return out;
};

var updateQueue = [];
var go = true;
var start = function(){
	go = true;
	requestAnimationFrame(render);
};
var stop = function(){
	go = false;
};
var render = function(time){
	var survivingObjects = [];
	if(go){
		requestAnimationFrame(render);
	}

	context.save();
	context.fillStyle = 'rgba(0, 0, 0, 0.5)';
	context.fillRect(0, 0, width, height);
	context.globalCompositeOperation = 'lighter';
	context.translate(halfWidth, halfHeight);

	updateQueue.forEach(function(item){
		item.update(time);
	});
	updateQueue.forEach(function(item){
		if(!item.isExpired){
			survivingObjects.push(item);
		}
	});
	updateQueue = survivingObjects;
	updateQueue.forEach(function(item){
		item.render();
	});

	context.restore();
};



var Dot = function (args) {
	args = args || {};
	this.position = args.position || vec2.create();
	this.velocity = args.velocity || vec2.create();
	this.speed = args.speed || Math.random() * 3 + 1;
	this.hue = args.hue || Math.random();
	this.color = hslaString(this.hue, 1, 0.5, 1);
	this.velocity[0] = this.speed;
	rotate(this.velocity, this.velocity, Math.random() * tau);
	updateQueue.push(this);
};
Dot.prototype = {
	update: function(time){
		this.velocityCurl = (Math.random() - 0.5) * deg * 20;
		rotate(this.velocity, this.velocity, this.velocityCurl);
		this.position[0] += this.velocity[0];
		this.position[1] += this.velocity[1];
		if(this.position[0] > halfWidth){this.velocity[0] *= -1;}
		if(this.position[0] < -halfWidth){this.velocity[0] *= -1;}
		if(this.position[1] > halfHeight){this.velocity[1] *= -1;}
		if(this.position[1] < -halfHeight){this.velocity[1] *= -1;}
	},
	render: function(time){
		drawCircle(this.position, 10, this.color);
	}
};

var myDotList = [];
var howManyDots = 20;
for (var i = 0; i < howManyDots; i++) {
	myDotList.push(new Dot());
};

start();
