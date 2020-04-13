module.exports = {

	name: "Bot Typing",

	section: "Bot Client Control",

	subtitle: function(data) {
		const channels = ['Same Channel', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
		const name = ['Starts Typing', 'Stops Typing'];
		return `${name[parseInt(data.typing)]} - ${channels[parseInt(data.storage)]}`
	},

	fields: ["storage", "varName", "typing", "amount"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 40%;">
			Typing Option:<br>
			<select id="typing" class="round">
			<option value="0" selected>Start Typing</option>
			<option value="1">Stop Typing</option>
			</select>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 35%;">
			Channel to start typing in:<br>
			<select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
				${data.channels[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		const placeholder = document.getElementById('placeholder');

		glob.channelChange(document.getElementById('storage'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.VarName, cache);
		const channel = this.getChannel(storage, varName, cache);
		let typing = parseInt(data.typing);
		switch(typing) {
			case 0:
				channel.startTyping();
				break;
			case 1:
				channel.stopTyping(true);
				break;
		}

		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};