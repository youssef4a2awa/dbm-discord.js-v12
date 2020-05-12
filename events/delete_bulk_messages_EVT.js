module.exports = {

name: "Delete Bulk Messages MOD",

isEvent: true,

fields: ["Temp Variable Name (stores list of messages):", "Temp Variable Name (stores amount of messages):"],

mod: function(DBM) {

	DBM.LeonZ = DBM.LeonZ || {};

	DBM.LeonZ.messageDeleteBulk = function(messagesList) {
		const { Bot, Actions } = DBM;

		const events = Bot.$evts["Delete Bulk Messages MOD"];

		if(!events) return;

		const temp = {}
		const server = messagesList.array()[0].guild;
		for(let i = 0; i < events.length; i++) {
			const event = events[i];
			if(event.temp) temp[event.temp] = messagesList;
			if(event.temp2) temp[event.temp2] = messagesList.size;
			Actions.invokeEvent(event, server, temp);
		}
	};

	const onReady = DBM.Bot.onReady;
	DBM.Bot.onReady = function(...params) {
		DBM.Bot.bot.on("messageDeleteBulk", DBM.LeonZ.messageDeleteBulk);
		onReady.apply(this, ...params);
	}
}

};