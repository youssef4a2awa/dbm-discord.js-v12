module.exports = {

	name: "Canvas Edit Image Border",

	section: "Image Editing",

	subtitle: function(data) {
		const storeTypes = ["", "Temp Variable", "Server Variable", "Global Variable"];
		return `${storeTypes[parseInt(data.storage)]} (${data.varName})`;
	},

	github: "LeonZ2019/DBM",
	author: "LeonZ",
	version: "1.1.0",

	fields: ["storage", "varName", "circleinfo", "radius"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 45%;">
			Source Image:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select><br>
		</div>
		<div id="varNameContainer" style="float: right; width: 50%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 45%;">
			Circle:<br>
			<select id="circleinfo" class="round">
				<option value="0" selected>No</option>
				<option value="1">Yes</option>
			</select><br>
		</div>
		<div style="float: right; width: 50%;">
			Round Corner Radius:<br>
			<input id="radius" class="round" type="text" value="0"><br>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.refreshVariableList(document.getElementById('storage'));
	},

	action: function(cache) {
		const Canvas = require('canvas');
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const imagedata = this.getVariable(storage, varName, cache);
		if(!imagedata) {
			this.callNextAction(cache);
			return;
		}
		const image = new Canvas.Image();
		image.src = imagedata;
		const circleinfo = parseInt(data.circleinfo);
		const radius = parseInt(data.radius);
		let imagew = image.width;
		let imageh = image.height;
		const canvas = Canvas.createCanvas(imagew,imageh);
		const ctx = canvas.getContext('2d');
		if (radius > 0) {
			corner(radius);
		}
		if (circleinfo == 1 && imagew == imageh) {
			circle();
		}
		ctx.drawImage(image, 0, 0);
		const result = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		this.storeValue(result, storage, varName, cache);
		this.callNextAction(cache);

		function circle() {
			ctx.beginPath();
			ctx.arc(imagew/2, imageh/2, (imagew+imageh)/4 ,0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
		}
		function corner(r) {
			ctx.beginPath();
			ctx.moveTo(r,0);
			ctx.lineTo(imagew-r,0);
			ctx.quadraticCurveTo(imagew,0,imagew,r);
			ctx.lineTo(imagew,imageh-r);
			ctx.quadraticCurveTo(imagew,imageh,imagew-r,imageh);
			ctx.lineTo(r,imageh);
			ctx.quadraticCurveTo(0,imageh,0,imageh-r);
			ctx.lineTo(0,r);
			ctx.quadraticCurveTo(0,0,r,0);
			ctx.closePath();
			ctx.clip();
		}
	},

	mod: function(DBM) {
	}

};