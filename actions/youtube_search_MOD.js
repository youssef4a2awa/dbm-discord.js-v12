module.exports = {

	name: "YouTube Search",

	section: "Audio Control",

	subtitle: function (data) {
		return `Search for ${data.search}`;
	},

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		return ([data.varName, 'List']);
	},

	fields: ["search", "limit", "storage", "varName"],

	html: function (isEvent, data) {
		return `
	<div style="float: left; width: 100%">
		Search:<br>
		<input id="search" type="text" class="round"><br>
		Result limit:<br>
		<input id="limit" class="round" type="text" value="10" placeholder="Max = 10">
	</div>
	<div>
		<div style="float: left; width: 35%; padding-top: 16px;">
			Store In:<br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div style="float: right; width: 60%; padding-top: 16px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
	</div>`
	},

	init: function () {
	},

	action: async function (cache) {
		const data = cache.actions[cache.index];
		const search = this.evalMessage(data.search, cache);
		let limit = parseInt(data.limit);
		if (!limit || isNaN(limit) || limit > 10) {
			limit = 10;
		}
		const ytsr = require('ytsr');
		let filters = await ytsr.getFilters(search);
		filters = filters.get('Type').find(o => o.name == "Video");
		const result = await ytsr(null,{limit:10, nextpageRef: filters.ref});
		console.log(result.items)
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		this.storeValue(result.items, storage, varName, cache);
		this.callNextAction(cache);
	},

	mod: function (DBM) {
	}

};