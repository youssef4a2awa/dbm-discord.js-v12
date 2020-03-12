module.exports = {

name: "Send Image",

section: "Image Editing",

subtitle: function(data) {
	const channels = ['Same Channel', 'Command Author', 'Mentioned User', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
	return `${channels[parseInt(data.channel)]}`;
},

fields: ["storage", "varName", "channel", "varName2", "message"],

html: function(isEvent, data) {
	return `
<div>
	<div style="float: left; width: 35%;">
		Source Image:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Send To:<br>
		<select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer2')">
			${data.sendTargets[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Message:<br>
	<textarea id="message" rows="8" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`
},

init: function() {
	const {glob, document} = this;

	glob.refreshVariableList(document.getElementById('storage'));
	glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer2');
},

action: function(cache) {
	const data = cache.actions[cache.index];
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const image = this.getVariable(storage, varName, cache);
	if(!image) {
		this.callNextAction(cache);
		return;
	}
	const channel = parseInt(data.channel);
	const varName2 = this.evalMessage(data.varName2, cache);
	const target = this.getSendTarget(channel, varName2, cache);
	if(Array.isArray(target)) {
		const Images = this.getDBM().Images;
		Images.createBuffer(image).then(function(buffer) {
			this.callListFunc(target, 'send', [this.evalMessage(data.message, cache), {
				files: [
					{
						attachment: buffer,
						name: 'image.png'
					}
				]
			}]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		}.bind(this)).catch(this.displayError.bind(this, data, cache));
	} else if(target && target.send) {
		const Images = this.getDBM().Images;
		Images.createBuffer(image).then(function(buffer) {
			target.send(this.evalMessage(data.message, cache), {
				files: [
					{
						attachment: buffer,
						name: 'image.png'
					}
				]
			}).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		}.bind(this)).catch(this.displayError.bind(this, data, cache));
	} else {
		this.callNextAction(cache);
	}
},

mod: function(DBM) {
}

};