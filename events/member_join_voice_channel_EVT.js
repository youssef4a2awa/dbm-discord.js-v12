module.exports = {
	/**
	 * The author of the event.
	 * @type {string}
	*/
	author: 'Almeida',

	/**
	 * The name of the event type on the editor.
	 * @type {string}
	*/
	name: 'Member Join Voice Channel',

	/**
	 * Whether the object is of an event or not.
	 * @type {boolean}
	*/
	isEvent: true,

	/**
	 * The fields of the event (Variables); there can only be either: 0, 1 or 2.
	 * @type {Array<string>}
	*/
	fields: ['Temp Variable Name (stores member that entered the channel):', 'Temp Variable Name (stores channel that the member joined):'],

	/**
	 * The function that is ran when the software/bot starts.
	 * @param {Object<*>} DBM The DBM object.
	 * @return {void}
	 */
	mod(DBM) {
		DBM.MemberJoinVoiceChannel = DBM.MemberJoinVoiceChannel || {};

		const { Actions, Bot } = DBM;

		/**
		 * Runs through all the bots events and runs the one that apply.
		 * @param {User} oldUser The member before the voice state update.
		 * @param {User} newUser The member after the voice state update.
		 * @return {void}
		 */
		DBM.MemberJoinVoiceChannel.callAllEvents = async function(oldVoiceState, newVoiceState) {
			const events = Bot.$evts['Member Join Voice Channel'];
			if (!events) return;

			for (const event of events) {
				const temp = {};

				const oldChannel = oldVoiceState.channel;
				const newChannel = newVoiceState.channel;
				const server = (oldVoiceState || newVoiceState).guild;

				if (event.temp) temp[event.temp] = (oldVoiceState || newVoiceState).member;
				if (event.temp2) temp[event.temp2] = newChannel;

				if (!oldChannel && newChannel) Actions.invokeEvent(event, server, temp);
			}
		};

		/*
		 * This is required so we have access to the Discord Client.
		 */
		const onReady = DBM.Bot.onReady;
		DBM.Bot.onReady = function(...params) {
			DBM.Bot.bot.on('voiceStateUpdate', DBM.MemberJoinVoiceChannel.callAllEvents);
			onReady.apply(this, ...params);
		};
	},
};
