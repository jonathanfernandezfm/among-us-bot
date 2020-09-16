"use strict";

const Discord = require("discord.js");
const auth = require("./auth.json");

var bot = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

bot.login(auth.Token);

bot.on("ready", (evt) => {
	console.log("Bot online!");
});

bot.on("guildMemberAdd", (member) => {
	member.roles.add("750841875489095791");
});

bot.on("message", async (msg) => {
	if (msg.channel.id === "750810774548512869") {
		let value = msg.content.split(" ")[0];

		if (value.length === 6 && !/\d/.test(value)) {
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor("#00ba19")
				.setTitle("🚀 " + value.toUpperCase())
				.setDescription("Creada por " + msg.author.toString())
				.setTimestamp();

			const filter = (reaction, reaction_user) => {
				return true; //return reaction.emoji.name === "❌" && msg.author.id === reaction_user.id;
			};

			msg.delete();
			msg.channel.send(exampleEmbed).then(async (message_sended) => {
				await message_sended.react("❌");

				const collector = message_sended.createReactionCollector(filter, {});

				collector.on("collect", (reaction, user) => {
					if (reaction.emoji.name === "❌") {
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
					} else {
						setTimeout(() => {
							reaction.users.remove(user.id);
						}, 2000);
					}
				});

				collector.on("end", (collected) => {
					console.log(`Cancelled game. Collected ${collected.size} items`);
				});
			});
		} else {
			if (msg.author.id !== "751121479449706556") {
				msg.delete();
				const embed = new Discord.MessageEmbed()
					.setColor("#fc2003")
					.setTitle("🙏🏼 Solo códigos");

				msg.channel
					.send(embed)
					.then((msg_sended_embed) => {
						setTimeout(() => msg_sended_embed.delete(), 2000);
					})
					.catch((msg_sended_embed) => {
						msg_sended_embed.delete();
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

	if (
		msg.content.includes("clearChannel") &&
		msg.member._roles.find((role) => role === "754834672982294639")
	) {
		const fetched = await msg.channel.messages.fetch({ limit: 100 });
		msg.channel.bulkDelete(fetched);
	}

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
