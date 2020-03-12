module.exports = {

	name: "Create Server",

	section: "Server Control",

	subtitle: function(data) {
		return `${data.serverName}`;
	},

	author: "MrGold",

	version: "1.9.2",

	short_description: "Creates a Server",

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'Server']);
	},

	fields: ["serverName", "serverRegion", "verification", "storage", "varName"],

	html: function(isEvent, data) {
		return `
	<div>
    	<p>
        	<u>Mod Info:</u><br>
	    	Created by MrGold
    	</p>
	</div><br>
	<div style="padding-top: 8px;"> 
    	<div style="float: left; width: 560px;">
        	Server Name:<br>
	    	<input id="serverName" class="round" type="text">
	</div><br><br><br>
	<div style="padding-top: 8px;"> 
    	<div style="float: left; width: 35%;">
	    	Server Region:<br>
	    	<select id="serverRegion" class="round">
				<option value="brazil">Brazil</option>
				<option value="eu-central">Central Europe</option>
				<option value="hongkong">Hong Kong</option>
				<option value="japan">Japan</option>
				<option value="russia">Russia</option>
				<option value="singapore">Singapora</option>
				<option value="southafrica">South Africa</option>
				<option value="sydney">Sydney</option>
				<option value="us-central">US Central</option>
				<option value="us-east">US East</option>
				<option value="us-south">US South</option>
				<option value="us-west">EU West</option>
				<option value="eu-west">Western Europe</option>
	    	</select>
		</div>
		<div style="float right; width: 60%;">
			Verification Level:<br>
			<select id="verification" class="round>
				<option value="NONE" selected>None</option>
				<option value="LOW">Low</option>
				<option value="MEDIUM">Medium</option>
				<option value="HIGH">High</option>
				<option value="VERY_HIGH">Very High</option>
			</select>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;"> 
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div><br><br><br><br>
	<div style="float: left; width: 88%; padding-top: 20px;">
		<p>
		<b>NOTE:</b> <span style="color:red">This is only available to bots in less than 10 servers!
		</p>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const serverName = this.evalMessage(data.serverName, cache);

		if(!serverName) {
			this.callNextAction(cache);
			return;
		}

		const serverRegion = data.serverRegion;
		const icon = this.evalMessage(data.icon, cache);
		const verification = data.verification;
		const options = {};
		options.verificationLevel = verification;
		options.region = serverRegion;
		if (icon) {
			options.icon = icon;
		}

		client.guilds.create(serverName, options).then(function(server) {
    		const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(server, storage, varName, cache);
			this.callNextAction(cache);
		}.bind(this)).catch(this.displayError.bind(this, data, cache));
	},

	mod: function(DBM) {
	}

};