module.exports = {

	name: "On Audio Stop MOD",
	
	isEvent: true,
	
	fields: ["Temp Variable Name (stores server object):"],
	
	mod: function(DBM) {
		DBM.LeonZ.onStop = function(id) {
			console.log("stop")
			console.log(DBM.Audio.queue[id])
			const { Bot, Actions } = DBM;
			const events = Bot.$evts["On Audio Stop MOD"];
			if(!events) return;
			const temp = {};
			const server = Bot.bot.guilds.cache.get(id);
			for(let i = 0; i < events.length; i++) {
				const event = events[i];
				if(event.temp) temp[event.temp] = server;
				Actions.invokeEvent(event, server, temp);
			};
		};
	}
}