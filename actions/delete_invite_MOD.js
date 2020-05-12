module.exports = {

	name: "Delete Invite",

	section: "Invite Control",

	subtitle: function(data) {
		return `delete invite ${data.invite}`;
	},

	fields: ["invite", "reason"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="padding-top: 8px;">
			Source Invite:<br>
			<input class="round" id="invite" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" type="text">
		</div>
	</div><br><br><br>
	<div>
		Reason:<br>
		<textarea id="reason" rows="5" placeholder="Insert reason here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const invite = this.evalMessage(data.invite, cache);
		const reason = this.evalMessage(data.reason, cache);
		const client = this.getDBM().Bot.bot;

		client.fetchInvite(invite).then(invite => {
			if (reason) {
				invite.delete(reason);
			} else {
				invite.delete;
			};
			this.callNextAction(cache);
		}).catch(err => {
			this.displayError(data, cache, err);
		});
	},

	mod: function(DBM) {
	}

};