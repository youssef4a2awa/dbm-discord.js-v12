module.exports = {

	name: "Discord.JS v12",

	isCommandExtension: false,

	isEventExtension: false,

	isEditorExtension: true,

	fields: [],

	defaultFields: {

	},

	size: function () {
		return {
			width: 300,
			height: 170
		};
	},

	html: function (data) {
		return ``
	},

	init: function () {},

	close: function (document, data) {

	},

	load: function (DBM, projectLoc) {

	},

	save: function (DBM, data, projectLoc) {

	},

	updated: 0,
	fs: require('fs'),
	path: require("path"),

	mod: function (DBM) {
		if (!this.fs.existsSync('actions') || !this.fs.existsSync('events') || !this.fs.existsSync('bot_v12.js') || !this.fs.existsSync('dbm-discord.js-v12.json')) {
			console.log("Files and folders are missing, this will get files from github.")
			//this.update();
			return;
		}
		const configFile = './dbm-discord.js-v12.json';
		if (!this.fs.existsSync(configFile)) {
			return;
		}
		const config = JSON.parse(this.fs.readFileSync(configFile));
		if (!config.autoUpdate) {
			return;
		} else {
			this.update(config);
		}
	},
	
	update: async function (config) {
		const fetch = require("node-fetch");
		const unzip = require('unzipper');
		const api = 'https://api.github.com/repos/';
		const repository = 'LeonZ2019/dbm-discord.js-v12';
		const release = '/releases/latest';

		const res = await fetch(api+repository+release);
		const json = await res.json();
		if (config && config.version == json.tag_name) {
			return;
		}
		console.log(`Updating from GitHub ${repository} v ${json.tag_name}`);
		if (this.fs.existsSync('./_temp')) {
			this.fs.rmdirSync('./_temp',{recursive: true});
		}
		this.fs.mkdirSync('./_temp');

		const zip = await fetch(json.zipball_url)
		zip.body.pipe(unzip.Extract({path:'./_temp'}));
		zip.body.on('end', async () => {
			process.stdout.write(`${this.updated} Files has updated.`)
			const cwd = this.path.join('./_temp',this.fs.readdirSync('./_temp')[0]);
			const files = this.fs.readdirSync(cwd);
			files.forEach(file => {
				const filePath = this.path.join(cwd, file);
				if (this.fs.lstatSync(filePath).isDirectory()) {
					this.copyFolder(filePath, file);
				} else {
					this.copyFile(filePath, file);
				}
			})

			this.fs.rmdirSync('./_temp',{recursive: true});
			process.stdout.write('\n');
			console.log("Please run the bot again from console.")
			process.exit();
		});
	},

	copyFolder : function (source, target) {
		if ( !this.fs.existsSync(target) ) {
			this.fs.mkdirSync(target);
		}
		const files = this.fs.readdirSync(source);
		files.forEach(file => {
			const filePath = this.path.join(source, file);
			const destPath = this.path.join(target, file);
			if (this.fs.lstatSync(filePath).isDirectory()) {
				this.copyFolder(filePath, destPath);
			} else {
				this.copyFile(filePath, destPath);
			}
		})
	},

	copyFile : function (source, target) {
		this.fs.copyFileSync(source, target, this.fs.constants.COPYFILE_FICLONE);
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		this.updated += 1;
		process.stdout.write(`${this.updated} Files has updated.`);
	}

};