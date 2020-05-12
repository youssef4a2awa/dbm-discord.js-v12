module.exports = {

	name: "Find Invite",

	section: "Invite Control",

	subtitle: function(data) {
		return `${data.invite}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'Invite']);
	},

	fields: ["invite", "storage", "varName"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="padding-top: 8px;">
			Source Invite:<br>
			<input class="round" id="invite" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" type="text">
		</div><br>
	</div>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const invite = this.evalMessage(data.invite, cache);
		const client = this.getDBM().Bot.bot;

		client.fetchInvite(invite).then(function(invite) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(invite, storage, varName, cache);
			this.callNextAction(cache);
		}.bind(this)).catch(err => {
			this.displayError(data,cache,err)
		});
	},

	mod: function(DBM) {
	}

};