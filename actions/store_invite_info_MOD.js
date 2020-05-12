module.exports = {

		name: "Store Invite Info",

		section: "Invite Control",

		subtitle: function(data) {
			const info = ['Channel Object', 'Invite Creator', 'Creation Date', 'Expiration Date', 'Guild Object', 'Max. Uses', 'Is Temporary?', 'URL for Invite', 'Times Used','Easter Egg', 'Invite code']
			return `Store ${info[parseInt(data.info)]} from Invite`;
		},

		variableStorage: function(data, varType) {
			const type = parseInt(data.storage);
			if(type !== varType) return;
			const info = parseInt(data.info);
			let dataType = 'Unknown Type';
			switch(info) {
				case 0:
					dataType = 'Channel Object';
					break;
				case 1:
					dataType = 'User';
					break;
				case 2:
				case 3:
					dataType = 'Date';
					break;
				case 4:
					dataType = 'Guild';
					break;
				case 5:
				case 8:
				case 10:
					dataType = 'Number';
					break;
				case 6:
					dataType = 'Boolean';
					break;
				case 7:
					dataType = 'String';
					break;
			}
			return ([data.varName, dataType]);
		},

		fields: ["invite", "info", "storage", "varName"],

		html: function(isEvent, data) {
			return `
		<div>
			<div style="padding-top: 8px;">
				Source Invite:<br>
				<input class="round" id="invite" placeholder="Code or URL | e.g abcdef or discord.gg/abcdef" type="text">
			</div>
		</div>
		<div>
			<div style="padding-top: 8px; width: 70%;">
				Source Info:<br>
				<select id="info" class="round">
					<option value="0" selected>Channel object</option>
					<option value="1">Creator of invite</option>
					<option value="2">Creation date</option>
					<option value="3">Expiration date</option>
					<option value="4">Guild object</option>
					<option value="5">Max. uses</option>
					<option value="6">Is temporary?</option>
					<option value="7">Url for invite</option>
					<option value="8">Times used</option>
					<option value=10">Invite Code</option>
				</select>
			</div>
		</div>
		<div>
			<div style="float: left; width: 35%; padding-top: 8px;">
				Store Result In:<br>
				<select id="storage" class="round">
					${data.variables[1]}
				</select>
			</div>
			<div style="float: right; width: 60%; padding-top: 8px;">
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
			const info = parseInt(data.info);

			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);

			const client = this.getDBM().Bot.bot;
			client.fetchInvite(invite).then(function(invite) {
				if(!invite) this.callNextAction(cache);
				let result;
				console.log(invite)
				switch(info) {
					case 0:
						result = invite.channel;
						break;
					case 1:
						result = invite.inviter;
						break;
					case 2:
						result = invite.createdAt;
						break;
					case 3:
						result = invite.expiresAt;
						break;
					case 4:
						result = invite.guild;
						break;
					case 5:
						result = invite.maxUses;
						break;
					case 6:
						result = Boolean(invite.temporary);
						break;
					case 7:
						result = invite.url;
						break;
					case 8:
						result = invite.uses;
						break;
					case 10:
						result = invite.code;
						break;
					default:
						break;
				}

				if(result !== undefined) {
					this.storeValue(result, storage, varName, cache);
				}
				this.callNextAction(cache);	
			}.bind(this)).catch(err => {
				this.displayError(data,cache,err)
			})
		},

		mod: function(DBM) {
		}

};