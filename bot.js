"use strict";

const Discord = require("discord.js");
const auth = require("./auth.json");

var bot = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

bot.login(auth.Token);

bot.on("ready", (evt) => {
	console.log("Bot online!");
});

bot.on("guildMemberAdd", (member) => {
	const channel = member.guild.channels.cache.find((ch) => ch.name === "member-log");
	if (!channel) return;

	channel.send(`Bienvenido al servidor, ${member}`);
});

bot.on("message", async (msg) => {
	if (msg.channel.id === "750810774548512869") {
		let values = msg.content.split(" ");

		for (let i = 0; i < values.length; i++) {
			if (values.length === 1 && values[i].length === 4 && !/\d/.test(values[i])) {
				const exampleEmbed = new Discord.MessageEmbed()
					.setColor("#00ba19")
					.setTitle("🚀  " + values[i].toUpperCase());

				const filter = (reaction, reaction_user) => {
					return reaction.emoji.name === "❌" && msg.author.id === reaction_user.id;
				};

				msg.delete();
				msg.channel.send(exampleEmbed).then(async (message_sended) => {
					await message_sended.react("❌");

					message_sended
						.awaitReactions(filter, { max: 1, time: 20000, errors: ["time"] })
						.then((collection) => {
							collection.map((message_reaction) => {
								if (message_reaction.emoji.name === "❌") {
									const embed = new Discord.MessageEmbed()
										.setColor("#fc2003")
										.setTitle("❌ Game cancelado");

									message_sended
										.edit(embed)
										.then((message) => {
											setTimeout(() => message.delete(), 3000);
										})
										.catch((err) => {
											console.log("editErrorEmbed error", err);
										});
								}
							});
						});
				});
			} else {
				const error = new Discord.MessageEmbed()
					.setColor("##fc2003")
					.setTitle("❌ Sólo mensajes de códigos");

				msg.channel
					.send(error)
					.then((message) => {
						setTimeout(() => message.delete(), 3000);
					})
					.catch((err) => {
						console.log("editErrorEmbed error", err);
					});
			}
		}
	}

	// if (msg.content.includes("mute")) {
	// 	let channel = msg.member.voice.channel;
	// 	for (let member of channel.members) {
	// 		member[1].edit({ mute: true });
	// 	}
	// }

	// if (msg.content.includes("unmute")) {
	// 	let channel = msg.member.voice.channel;
	// 	for (let member of channel.members) {
	// 		member[1].edit({ mute: false });
	// 	}
	// }

	// if(msg.content.includes("clearChannel")){
	//     const fetched = await msg.channel.messages.fetch({limit: 100});
	//     msg.channel.bulkDelete(fetched);
	// }

	// if (msg.content.includes("createEmbed")) {
	// 	// if (msg.content.includes("mute")) {
	// 		// const filter = (reaction, user) =>
	// 		// 	["🔈", "🔇"].includes(reaction.emoji.name) && user.id === msg.author.id;

	// 		const exampleEmbed = new Discord.MessageEmbed()
	// 			.setColor("#fcb603")
	// 			.setTitle("Mute panel")
	// 			.setTimestamp();

	//         msg.delete();

	//         const filter = (reaction, user) => {
	//             console.log(user, msg.author);
	//             return reaction.emoji.name === '👍' && user.id === msg.author.id;
	//         };

	// 		msg.channel.send(exampleEmbed).then((embed) => {
	// 			embed.react("🔈");
	//             embed.react("🔇");
	//             console.log(embed.id, embed.channel);

	// 			embed
	// 				.awaitReactions(filter, { })
	// 				.then((collected) => {
	// 					const reation = collected.first();
	//                     console.log('tesdt');
	// 					if (reaction.emoji.name === "🔈") console.log("🔈");
	// 					if (reaction.emoji.name === "🔇") console.log("🔇");
	// 				})
	// 				.catch((collected) => {
	// 					message.reply("you reacted with neither a thumbs up, nor a thumbs down.");
	// 				});
	// 		});
	// 	// }
	// }
});

bot.on("messageReactionAdd", async (reaction, user) => {
	// if (reaction.partial) {
	// 	try {
	// 		await reaction.fetch();
	// 	} catch (error) {
	// 		console.log("Something went wrong when fetching the message: ", error);
	// 		return;
	// 	}
	// }
	// if (reaction.message.id === "751173045716254819") {
	// 	if (reaction.emoji.name === "🔈") {
	// 		let channel = reaction.users;
	// 		for (let member of channel.members) {
	// 			member[1].edit({ mute: true });
	// 		}
	// 	}
	// 	if (reaction.emoji.name === "🔇") {
	// 	}
	// }
	// console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
	// console.log(reaction.emoji.name === "🔈");
});
