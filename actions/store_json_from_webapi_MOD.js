
module.exports = {

	name: "Store Json From WebAPI",

	section: "JSON Things",

	subtitle: function(data) {
		return `${data.varName}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, 'JSON Object']);
	},

	fields: ["url", "headers", "path", "storage", "varName", "cache"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 95%;">
			WebAPI URL:<br>
			<textarea id="url" class="round" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea><br>
			Headers:<br>
			<textarea id="headers" class="round" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20">{"Content-Type":"application/json"}</textarea><br>
	</div><br><br><br><br><br><br><br>
	<div>
		<div style="float: left; width: 65%;">
			JSON Path: (Support Regex)<br>
			<input id="path" class="round" type="text">
		</div>
		<div style="padding-left: 3px; float: left; width: 30%;">
			Cache:<br>
			<select id="cache" class="round">
				<option value="0" selected>True</option>
				<option value="1">False</option>
				<option value="2">True (Reload)</option>
				<option value="3">False (Reload)</option>
			</select>
		</div>
	<div>
		<div style="padding-top: 13px; float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round">
			${data.variables[1]}
			</select><br>
		</div>
		<div style="padding-top: 13px; float: right; width: 60%;">
			JSON Storage Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>`
	},

	init: function() {
	},

	action: async function(cache) {

		const data = cache.actions[cache.index];
		const url = this.evalMessage(data.url, cache);
		const headers = this.evalMessage(data.headers, cache);
		const path = this.evalMessage(data.path, cache);
		const Cache = parseInt(this.evalMessage(data.cache, cache))
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const {JSONPath} = require('jsonpath-plus');
		const fetch = require('node-fetch');
		try {
			let options;
			if (headers) {
				try {
					options = JSON.parse(headers);
				} catch (err) {
					console.error(err)
					options = {method:"get"};
				}
			} else {
				options = {method:"get"};
			}
			let json;
			if ([0,1].includes(Cache)) {
				json = this.getVariable(1, "_"+url, cache);
			}
			if (typeof json == "undefined") {
				const res = await fetch(url,options);
				json = await res.json();
			}
			if ([0,2].includes(Cache)) {
				this.storeValue(json, 1,"_"+url, cache);
			}
			let result;
			if (path) {
				result = JSONPath({path:path,json});
			} else {
				result = json;
			}
			if (result.length <= 1) result = result[0];
			this.storeValue(result, storage, varName, cache);
			this.callNextAction(cache);
		} catch (e) {
			this.displayError(data, cache, e)
		}
	},

};