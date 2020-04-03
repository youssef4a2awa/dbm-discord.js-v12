module.exports = {
	
	name: "On Audio Play MOD",
	
	isEvent: true,
	
	fields: ["Temp Variable Name (stores server object):", "Temp Variable Name (stores voice channel object):"],
	
	mod: function(DBM) {
		DBM.LeonZ.onPlay = function(item,id) {
			let playing = false;
			if (DBM.LeonZ.play[id]) {
				if (item.url != DBM.LeonZ.play[id].url) {
					DBM.LeonZ.play[id] = item;
					playing = true;
				}
			} else {
				playing = true;
				DBM.LeonZ.play[id] = item;
			}
			if (playing) {
				console.log("play")
				console.log(DBM.Audio.queue[id])
				const { Bot, Actions } = DBM;
				const events = Bot.$evts["On Audio Play MOD"];
				if(!events) return;
				const temp = {};
				const server = Bot.bot.guilds.cache.get(id);
				const voiceChannel = server.me.voice.channel;
				for(let i = 0; i < events.length; i++) {
					const event = events[i];
					if(event.temp) temp[event.temp] = server;
					if(event.temp2) temp[event.temp2] = voiceChannel;
					Actions.invokeEvent(event, server, temp);
				};
			};
		};
	
		const onReady = DBM.Bot.onReady;
		DBM.Bot.onReady = function(...params) {
			DBM.LeonZ = DBM.LeonZ || {};
			DBM.LeonZ.play = {};
			onReady.apply(this, ...params);
		};
	}
}