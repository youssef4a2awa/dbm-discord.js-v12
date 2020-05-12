module.exports = {
 
	name: "Parse From Stored Json",

	section: "JSON Things",

	subtitle: function(data) {
		return `${data.varName}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		if (varType == typeof object) return [data.varName, "JSON Object"];
		else {
			return [data.varName, "JSON " + varType + " Value"];
		}
	},

	fields: ["storage", "json", "path", "storage2", "varName"],

	html: function(isEvent, data) {
	return `
	<div>
		<div style="padding-top: 13px; float: left; width: 35%;">
			Source JSON Object:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div style="padding-top: 13px; float: right; width: 60%;">
			JSON Storage Variable Name:<br>
			<input id="json" class="round" type="text" list="variableList">
		</div>
	</div>
	<div>
		<div style="padding-top: 13px; float: left; width: 93%;">
			JSON Path: (Support Regex)<br>
			<input id="path" class="round" type="text">
		</div>
	</div>
	<div>
		<div style="padding-top: 13px; float: left; width: 35%;">
			Store In:<br>
			<select id="storage2" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div style="padding-top: 13px; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;	
		glob.refreshVariableList(document.getElementById('storage'));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const {JSONPath} = require('jsonpath-plus');

		const storage = parseInt(data.storage);
		const jsonName = this.evalMessage(data.json, cache);
		const json = this.getVariable(storage, jsonName, cache);
		const path = this.evalMessage(data.path, cache);

		if (path) {
			try {
				result = JSONPath({path:path,json});
				if (result.length <= 1) result = result[0];
				console.log(result)
				const varName = this.evalMessage(data.varName, cache);
				const storage2 = parseInt(data.storage2);
				this.storeValue(result, storage2, varName, cache);
				this.callNextAction(cache);
			} catch (err) {
				this.displayError(data, cache, err)
			}
		} else {
			console.error("Path not defined.")
		}
		/*if (typeof jsonRaw !== "object") {
			jsonData = JSON.parse(jsonRaw);
		} else {
			jsonData = jsonRaw;
		}

		try {
			if (path && jsonData) {
				let outData = WrexMODS.jsonPath(jsonData, path);
				if (outData == false) {
					outData = WrexMODS.jsonPath(jsonData, "$." + path);
				}
				if (outData == false) {
					outData = WrexMODS.jsonPath(jsonData, "$.." + path);
				}

				if(DEBUG) console.log(outData);

				try {
					var test = JSON.parse(JSON.stringify(outData));
				} catch (error) {
					var errorJson = JSON.stringify({ error: error, success: false });
					this.storeValue(errorJson, storage, varName, cache);
					console.error(error.stack ? error.stack : error);
				}

				var outValue = eval(JSON.stringify(outData), cache);

				if (outData.success != null || outValue.success != null) {
					var errorJson = JSON.stringify({
						error: "error",
						statusCode: 0,
						success: false
					});
					this.storeValue(errorJson, storage, varName, cache);
					console.log("WebAPI Parser: Error Invalid JSON, is the Path set correctly? [" + path + "]");
				} else {
					if (outValue.success != null || !outValue) {
						var errorJson = JSON.stringify({
							error: error,
							statusCode: statusCode,
							success: false
						});
						this.storeValue(errorJson, storage, varName, cache);
						console.log("WebAPI Parser: Error Invalid JSON, is the Path set correctly? [" + path + "]");
					} else {
						this.storeValue(outValue, storage, varName, cache);
						if(DEBUG) console.log("WebAPI Parser: JSON Data values starting from [" + path + "] stored to: [" + varName + "]");
					}
				}
			}
		} catch (error) {
			var errorJson = JSON.stringify({error: error, statusCode: 0, success: false});
			this.storeValue(errorJson, storage, varName, cache);
			console.error("WebAPI Parser: Error: " + errorJson + " stored to: [" + varName + "]");
		}

		if (data.behavior === "0") {
			this.callNextAction(cache);
		}*/

	},

	mod: function(DBM) {
	}

};