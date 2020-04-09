module.exports = {

	name: "Play Audio",

	section: "Audio Control",

	subtitle: function(data) {
		return `${data.url}`;
	},

	fields: ["type", "Ptype", "play", "seek", "volume", "bitrate"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Audio Type:<br>
			<select id="type" class="round" type="text" onchange="glob.onChange(this)">
				<option value="0" selected>Youtube</option>
				<option value="1">Local</option>
				<option value="2">URL</option>
			</select>
		</div>
		<div style="padding-left: 3%; float: left; width: 60%;">
			Play Type:<br>
			<select id="Ptype" class="round">
				<option value="0" selected>Add to Queue</option>
				<option value="1">Play Immediately</option>
			</select>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 100%;">
			Play URL:<br>
			<input id="play" class="round" type="text">
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 35%;">
			Seek Position:<br>
			<input id="seek" class="round" type="text" value="0"><br>
		</div>
		<div style="padding-left: 3%; float: left; width: 60%;">
			Volume (0 = min; 100 = max):<br>
			<input id="volume" class="round" type="text" placeholder="Leave blank for automatic..."><br>
			Bitrate (kbps):<br>
			<input id="bitrate" class="round" type="text" placeholder="Leave blank for automatic...">
		</div>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const item = {};
		item.options = {};
		if(data.seek) {
			item.options.seek = parseInt(this.evalMessage(data.seek, cache));
		}
		if(data.volume) {
			item.options.volume = parseInt(this.evalMessage(data.volume, cache)) / 100;
		} else {
			item.options.volume = 0.99;
		}
		if(data.bitrate) {
			item.options.bitrate = parseInt(this.evalMessage(data.bitrate, cache));
		} else {
			item.options.bitrate = 'auto';
		}
		item.options.fec = true;
		item.options.plp = 0;
		item.options.highWaterMark = 20;
		item.cache = false;
		item.url = this.evalMessage(data.play, cache);
		const requester = this.getMember(1, '', cache);
		if (requester) {
			item.requester = requester;
		} else {
			item.requester = 'unknown';
		}
		switch (parseInt(data.type)) {
			case 0:
				item.type = 'yt';
				break;
			case 1:
				item.type = 'file';
				break;
			case 2:
				item.type = 'url';
				break;
		}
		if(parseInt(data.Ptype) == 0) {
			Audio.addToQueue(item, cache.server.id);
		} else {
			Audio.playItem(item, cache.server.id, true);
		}
		this.callNextAction(cache);
	},

	mod: function(DBM) {
	}

};