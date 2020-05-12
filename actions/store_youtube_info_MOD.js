module.exports = {

	name: "Store YouTube Info",

	section: "Audio Control",

	subtitle: function (data) {
		const info = ['Video URL', 'Video ID', 'Video Title', 'Video Description', 'Video Thumbnail URL', 'Video Author Name', 'Video Author URL', 'Video Author Thumbnail URL', 'Video Age Restriction', 'Video Duration', 'Video Duration (Seconds)', 'Video Likes', 'Video Dislikes', 'Video View Count'];
		return `${info[parseInt(data.info)]}`;
	},

	variableStorage: function (data, varType) {
	const type = parseInt(data.storage2);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = 'Unknown YouTube Type';
		switch (info) {
			case 0:
			case 4:
			case 6:
			case 7:
				dataType = "URL";
				break;
			case 1:
			case 2:
			case 3:
			case 5:
			case 9:
				dataType = "Text";
				break;
			case 10:
			case 11:
			case 12:
			case 13:
				dataType = "Number";
				break
			case 8:
				dataType = "Boolean";
				break;
		}
		return ([data.varName2, dataType]);
	},

	fields: ["storage", "varName", "info", "storage2", "varName2"],	
	html: function (isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%; padding-top: 8px;">
			Source Video Object:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div>
		<div style="width: 95%; padding-top: 8px;">
			Source Info:<br>
			<select id="info" class="round">
				<option value="0">Video URL</option>
				<option value="1">Video ID</option>
				<option value="2">Video Title</option>
				<option value="3">Video Description</option>
				<option value="4">Video Thumbnail URL</option>
				<option value="5">Video Author Name</option>
				<option value="6">Video Author URL</option>
				<option value="7">Video Author Thumbnail URL</option>
				<option value="8">Video Age Restriction</option>
				<option value="9">Video Duration</option>
				<option value="10">Video Duration (Seconds)</option>
				<option value="11">Video Likes</option>
				<option value="12">Video Dislikes</option>
				<option value="13">Video View Count</option>
				<option value="14">Video Author Subscriber Count</option>
			</select>
		</div>
	</div>
	<div>
		<div style="float: left; width: 35%;  padding-top: 8px;">
			Store In:<br>
			<select id="storage2" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text"><br>
		</div>
	</div>`;
	},

	init: function () {
		const {glob, document} = this;	
		glob.refreshVariableList(document.getElementById('storage'));
	},

	action: async function (cache) {
		const data = cache.actions[cache.index];
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		const object = this.getVariable(storage, varName, cache);
		const info = parseInt(data.info);
		const ytdl = this.getDBM().Audio.ytdl;
		let result ,res;
		switch(info) {
			case 0:
				result = object.link;
				break;
			case 1:
				result = ytdl.getURLVideoID(object.link);
				break;
			case 2:
				result = object.title;
				break;
			case 3:
				res = await ytdl.getInfo(object.link);
				result = res.description;
				break;
			case 4:
				result = "https://i.ytimg.com/vi/" + ytdl.getURLVideoID(object.link) + "/maxresdefault.jpg";
				break;
			case 5:
				result = object.author.name;
				break;
			case 6:
				result = object.author.ref;
				break;
			case 7:
				res = await ytdl.getInfo(object.link);
				result = res.author.avatar.split("=")[0];
				break;
			case 8:
				res = await ytdl.getInfo(object.link);
				result = res.age_restricted;
				break;
			case 9:
				result = object.duration;
				break;
			case 10:
				res = await ytdl.getInfo(object.link);
				result = parseInt(res.length_seconds);
				break;
			case 11:
				res = await ytdl.getInfo(object.link);
				result = res.likes;
				break;
			case 12:
				res = await ytdl.getInfo(object.link);
				result = res.dislikes;
				break;
			case 13:
				result = object.views;
				break;
			case 14:
				result = object.author.subscriber_count;
		}
    	if (result !== undefined) {
        	const storage2 = parseInt(data.storage2);
        	const varName2 = this.evalMessage(data.varName2, cache);
        	this.storeValue(result, storage2, varName2, cache);
    	}
		this.callNextAction(cache);
	},
	mod: function (DBM) {}

};