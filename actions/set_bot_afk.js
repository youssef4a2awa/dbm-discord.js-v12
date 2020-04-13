module.exports = {

	name: "Set Bot AFK Status",

	section: "Bot Client Control",

	subtitle: function(data) {
		return data.status=="0" ? `AFK` : `Not AFK`;
	},

	fields: ["status"],

	html: function(isEvent, data) {
		return `
	<div style="float: left; width: 80%;">
		AFK Status:<br>
		<select id="status" class="round">
			<option value="0">AFK</option>
			<option value="1">Not AFK</option>
		</select>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const botClient = this.getDBM().Bot.bot.user;
		const data = cache.actions[cache.index];
		const afk = Boolean(data.status == "0");
		botClient.setAFK(afk).then(function() {
			this.callNextAction(cache);
		}.bind(this)).catch(this.displayError.bind(this, data, cache));
	},

	mod: function(DBM) {
	}

};