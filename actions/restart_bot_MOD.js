module.exports = {

	name: "Restart Bot",

	section: "Bot Client Control",

	subtitle: function(data) {
		return `Restarts Bot`
	},

	fields: [],

	html: function(isEvent, data) {
		return `
	<div>
		<p>
			<u>NOTE:</u><br>
			Any action that is below this mod will not be executed!
		</p>
	</div>`
	},

	init: function() {
	},

	action: function(cache) {
		const child = require('child_process')
		const path = require('path');
		const filename = path.basename(process.argv[1]);
		this.getDBM().Bot.bot.destroy();
		console.log(`Restarting ${filename}...`)
		child.execSync(`node ${filename}`,{cwd: process.cwd(),stdio:[0,1,2]}).catch(e => console.error('An error in Restart Bot MOD: ' + e))
	},

	mod: function(DBM) {}

};