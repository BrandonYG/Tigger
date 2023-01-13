const { Events } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setPresence({
			activities: [{ name: "with ur dad" }],
			status: "mobile",
		});
		console.log("Tigger is online.");
	},
};
