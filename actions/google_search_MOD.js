module.exports = {

	name: "Google Search",

	section: "Other Stuff",

	subtitle: function (data) {
		const info = ['Title', 'URL', 'Snippet'];
		return `Google Result ${info[parseInt(data.info)]}`;
	},

	author: "EGGSY",

	version: "1.8.7",

	short_description: "Googles the given text!.",

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown Google Type';
		switch (info) {
			case 0:
				dataType = "Google Result Title";
				break;
			case 1:
				dataType = "Google Result URL";
				break;
			case 2:
				dataType = "Google Result Snippet";
				break;
		}
		return ([data.varName, dataType]);
	},

	fields: ["string", "info", "resultNo", "storage", "varName"],

	html: function (isEvent, data) {
		return `
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by EGGSY!
		</p>
	</div><br>
	<div style="width: 95%; padding-top: 8px;">
		String(s) to Search on Google:<br>
		<textarea id="string" rows="5" placeholder="Write something or use variables to Google search it..." style="width: 100%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div><br>
	<div style="float: left; width: 45%; padding-top: 8px;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0">Result Title</option>
			<option value="1">Result URL</option>
			<option value="2">Result Snippet (Description)</option>
		</select>
	</div>
	<div style="float: left; width: 50%; padding-left: 10px; padding-top: 8px;">
		Result Number:<br>
		<select id="resultNo" class="round">
			<option value="0">1st Result</option>
			<option value="1">2nd Result</option>
			<option value="2">3rd Result</option>
			<option value="3">4th Result</option>
			<option value="4">5th Result</option>
			<option value="5">6th Result</option>
			<option value="6">7th Result</option>
			<option value="7">8th Result</option>
			<option value="8">9th Result</option>
			<option value="9">10th Result</option>
		</select>
	</div><br><br>
	<div style="float: left; width: 43%; padding-top: 8px;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 53%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
	</div>`
	},

	init: function () {
		const { glob, document } = this;
		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	action: function (cache) {
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
		const string = this.evalMessage(data.string, cache).replace(/[\u{0080}-\u{FFFF}]/gu, "");
		const resultNumber = parseInt(data.resultNo);

		if (!string) return console.log("Please write something to Google it!");


		const WrexMODS = this.getWrexMods();
		WrexMODS.CheckAndInstallNodeModule('google-it');
		const googleIt = WrexMODS.require('google-it');

		googleIt({ 'query': `${string}`, 'no-display': 1, 'limit': 10 }).then(results => {
			switch (info) {
				case 0:
					result = results[resultNumber].title;
					break;
				case 1:
					result = results[resultNumber].link;
					break;
				case 2:
					result = results[resultNumber].snippet;
					break;
				default:
					break;
			}
			if (result !== undefined) {
				const storage = parseInt(data.storage);
				const varName2 = this.evalMessage(data.varName, cache);
				this.storeValue(result, storage, varName2, cache);
				this.callNextAction(cache);
			} else {
				this.callNextAction(cache);
			}
		}).catch(e => {
			console.log("An error in Google Search MOD: " + e);
			this.callNextAction(cache);
		})
	},

	mod: function (DBM) { }

};