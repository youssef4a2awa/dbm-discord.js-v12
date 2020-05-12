module.exports = {
	
	name: "Member Vote on top.gg MOD",
	
	isEvent: true,
	
	fields: ["Webhook Authorization:", "Temp Variable Name (stores user that just voted):"],
	
	mod: function(DBM) {
	
		DBM.DBL = DBM.DBL || {};
	
		const onReady = DBM.Bot.onReady;
		DBM.Bot.onReady = function(...params) {
			DBM.DBL.start();
			onReady.apply(this, ...params);
		}
	
		DBM.DBL.start = function() {
			const events = DBM.Bot.$evts["Member Vote on top.gg MOD"];
			if (!events) return;
			if (events.length > 1) {
				console.error("Member Vote on top.gg MOD currently only works in one event.")
				return;
			}
			const event = events[0];
			const express = require('express');
			const http = require('http');
			const authorization = event.temp;
		
			const app = express();
			app.use(express.json({extended: false}))
			app.post('/dblwebhook', async (req, res) => {
				if (req.headers.authorization) {
					if (req.headers.authorization == authorization) {
						res.send({status: 200});
						if (req.body && req.body.type == 'upvote') {
							let user = DBM.Bot.bot.users.get(req.body.user);
							if(event.temp2 && typeof user != "undefined") temp[event.temp2] = user;
							Actions.invokeEvent(event, 'null', temp);
						}
					} else {
						res.status('401').send({status: 401, error: 'The auth received does not match the one in the authorization'})
					}
				} else {
					res.status('403').send({status: 403, error: 'There was no auth header in the webhook, please set authorization in your dbl webhook setting.'})
				}
			})
			const server = http.createServer(app).listen(4000);
			console.log("DBL Webhook listen on port 4000")
		
			process.on('exit', () => {
				server.close();
			})
		}
	}
}