module.exports = {

	name: "Control Audio",

	section: "Audio Control",

	subtitle: function(data) {
		const actions = ["Stop Playing", "Pause Audio", "Resume Audio", "Forward Audio", "Rewind Audio", "Replay Audio", "Play At Seek"];
		return `${actions[parseInt(data.action)]}`;
	},

	fields: ["action", "amount"],

	html: function(isEvent, data) {
		return `
	<div style="float: left; width: 40%;">
		Audio Action:<br>
		<select id="action" class="round" onchange="glob.onChange(this)">
			<option value="0" selected>Stop Playing</option>
			<option value="1">Pause Audio</option>
			<option value="2">Resume Audio</option>
			<option value="3">Forward Audio</option>
			<option value="4">Rewind Audio</option>
			<option value="5">Replay Audio</option>
			<option value="6">Play at Seek</option>
		</select>
	</div>
	<div id="placeholder" style="float: right; width: 55%; display: none;">
		Amount:<br>
		<input id="amount" type="text" class="round">
	</div>`;
	},

	init: function() {
		const {glob, document} = this;

		glob.onChange = function(action) {
			const value = parseInt(action.value);
			const placeholder = document.getElementById("placeholder");
			switch(value) {
				case 0:
				case 1:
				case 2:
				case 5:
					placeholder.style.display = "none";
					break;
				case 3:
				case 4:
				case 6:
					placeholder.style.display = null;
					break;
			}
		};

		glob.onChange(document.getElementById('action'));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const server = cache.server;
		let dispatcher;
		if(server) {
			dispatcher = Audio.dispatchers[server.id];
		} 
		if(dispatcher) {
			const action = parseInt(data.action);
			let amount;
			switch(action) {
				case 0:
					DBM.LeonZ.onStop(server.id);
					dispatcher.destroy();
					break;
				case 1:
					dispatcher.pause(true);
					break;
				case 2:
					if (typeof dispatcher == "undefined") {
						Audio.playNext(server.id);
					} else {
						dispatcher.resume();
					}
					break;
				case 3:
					amount = parseInt(this.evalMessage(data.amount, cache));
					Audio.controlAudio(server.id, 3, amount);
					break;
				case 4:
					amount = parseInt(this.evalMessage(data.amount, cache));
					Audio.controlAudio(server.id, 4, amount);
					break;
				case 5:
					Audio.controlAudio(server.id, 5)
					break;
				case 6:
					amount = parseInt(this.evalMessage(data.amount, cache));
					Audio.controlAudio(server.id, 6, amount);
					break;
			}
		}
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};