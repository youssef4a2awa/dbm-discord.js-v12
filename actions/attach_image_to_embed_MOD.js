module.exports = {

	name: 'Attach Image To Embed',

	section: 'Embed Message',

	subtitle: function (data) {
		const array = ['Temp Variable', 'Server Variable', 'Global Variable']
		return `Attach (${array[data.imagestorage - 1]} ${data.imagevarName}) to Embed (${array[data.embedstorage - 1]} ${data.embedvarName}) (${data.filename || 'image.png'})`
	},

	author: 'Sangoon_Is_Noob#1683',

	version: '1.9.5',

	short_description: 'Changed Category & UI',

	fields: ['embedstorage', 'embedvarName', 'imagestorage', 'imagevarName', 'filename'],

	html: function (isEvent, data) {
		return `
		<div>
			<div style="float: left; width: 35%;">
				Source Embed Object:<br>
				<select id="embedstorage" class="round" onchange="glob.refreshVariableList(this)">
					${data.variables[1]}
				</select>
			</div>
			<div id="varNameContainer" style="float: right; width: 60%;">
				Variable Name:<br>
				<input id="embedvarName" class="round" type="text" list="variableList">
			</div>
		</div><br><br><br>
		<div>
			<div style="float: left; width: 35%;">
				Image Object to Attach:<br>
				<select id="imagestorage" class="round" onchange="glob.refreshVariableList(this)">
					${data.variables[1]}
				</select>
			</div>
			<div id="varNameContainer" style="float: right; width: 60%;">
				Variable Name:<br>
				<input id="imagevarName" class="round" type="text" list="variableList"><br>
			</div><br><br><br>
			<div id="varNameContainer" style="float: right; width: 60%;">
				Image File Name:<br>
				<input id="filename" class="round" type="text" placeholder="image.png"><br>
			</div>
		</div>`
	},

	init: function () {
	},

	action: function (cache) {
		const data = cache.actions[cache.index]

		const embedstorage = parseInt(data.embedstorage)
		const embedvarName = this.evalMessage(data.embedvarName, cache)
		const embed = this.getVariable(embedstorage, embedvarName, cache)
		const imagestorage = parseInt(data.imagestorage)
		const imagevarName = this.evalMessage(data.imagevarName, cache)

		const filename = data.filename || 'image.png'
		const CanvasJS = this.getDBM().CanvasJS;
		const img = this.getVariable(imagestorage, imagevarName, cache);
		const attachment = CanvasJS.toAttachment(img, filename);
		embed.attachFiles([attachment]);
		this.callNextAction(cache);
	},

	mod: function (DBM) {
	}

}