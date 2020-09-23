"use strict";

const Discord = require("discord.js");
const auth = require("./auth.json");

var bot = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

bot.login(auth.Token);

bot.on("ready", (evt) => {
	console.log("Bot online!");
	bot.channels.cache.forEach((channel) => {
		if (channel.name.includes("🚀 Partida ") && channel.members.size === 0) {
			let partida_number = channel.name.replace("🚀 Partida ", "");
			let channel_text = bot.channels.cache.find(
				(ch) => ch.name === "💬chat-partida-" + partida_number
			);
			console.log("Limpiando canales -> " + channel.name);
			channel_text.delete();
			channel.delete();
		}
	});
});

bot.on("guildMemberAdd", (member) => {
	member.roles.add("750841875489095791");
});

bot.on("message", async (msg) => {
	if (msg.channel.id === "758340770331099157" || msg.channel.id === "752621705440264242") {
		let value = msg.content.split(" ")[0];

		let voice_channel = msg.guild.members.resolve(msg.author.id).voice.channel;
		if (value.length === 6 && !/\d/.test(value)) {
			if (!voice_channel) {
				msg.delete();
				const embed = new Discord.MessageEmbed()
					.setColor("#fc2003")
					.setTitle("🙏🏼 Crea un canal de voz para tu partida.");

				msg.channel
					.send(embed)
					.then((msg_sended_embed) => {
						setTimeout(() => msg_sended_embed.delete(), 2000);
					})
					.catch((msg_sended_embed) => {
						msg_sended_embed.delete();
					});

				return;
			}

			const exampleEmbed = new Discord.MessageEmbed()
				.setColor("#00ba19")
				.setTitle("🚀 " + value.toUpperCase())
				.setDescription("Sala: " + voice_channel.name)
				// .addFields([{ name: "Partida", value: voice_channel.name }])
				.setTimestamp()
				.setFooter("Creada por " + msg.author.tag);

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
			if (
				msg.author.id !== "751121479449706556" &&
				!msg.member._roles.find((role) => role === "750841836058312805")
			) {
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

	if (
		msg.content.includes("clearChannel") &&
		msg.member._roles.find((role) => role === "754834672982294639")
	) {
		const fetched = await msg.channel.messages.fetch({ limit: 100 });
		msg.channel.bulkDelete(fetched);
	}
});

bot.on("voiceStateUpdate", (oldState, newState) => {
	if (newState.channelID === "758340869500960839") {
		let contador = 1;

		newState.guild.channels.cache.forEach((channel) => {
			if (channel.name.includes("🚀 Partida ")) contador += 1;
		});

		newState.guild.channels
			.create("🚀 Partida " + contador, {
				type: "voice",
				parent: "758340792426692628",
				permissionOverwrites: [],
				position: 40,
				reason: "Nuevo canal para partida",
			})
			.then((channel) => {
				newState.member.voice
					.setChannel(channel.id)
					.catch((err) => console.log("Error moviendo usuario -> " + err));

				newState.guild.channels
					.create("💬Chat partida " + contador, {
						type: "text",
						parent: "758341343826935898",
						permissionOverwrites: [
							{ id: newState.guild.id, deny: ["VIEW_CHANNEL"] },
							{ id: newState.member.id, allow: ["VIEW_CHANNEL"] },
						],
						position: 40,
						reason: "Nuevo canal de texto privado para partida",
					})
					.catch((err) => console.log("Error creando chat de texto privado -> " + err));
			})
			.catch((err) => {
				console.log(err);
			});
	}

	if (
		oldState.channel !== null &&
		oldState.channel.name.includes("🚀 Partida ") &&
		oldState.channel.members.size === 0
	) {
		oldState.channel
			.delete()
			.catch((err) => console.log("Error eliminando canal vacio -> " + err));

		let partida_number = oldState.channel.name.replace("🚀 Partida ", "");
		oldState.guild.channels.cache.forEach((channel) => {
			if (channel.name === "💬chat-partida-" + partida_number) {
				channel.delete();
			}
		});
	}

	if (newState.channel !== null && newState.channel.name.includes("🚀 Partida ")) {
		let partida_number = newState.channel.name.replace("🚀 Partida ", "");

		let channel_text = newState.guild.channels.cache.find(
			(ch) => ch.name === "💬chat-partida-" + partida_number
		);

		if (channel_text) {
			channel_text.updateOverwrite(newState.member.id, {
				SEND_MESSAGES: true,
				VIEW_CHANNEL: true,
			});
		}
	}

	if (
		oldState.channel !== null &&
		oldState.channel.name.includes("🚀 Partida ") &&
		oldState.channel.members.size !== 0
	) {
		let partida_number = oldState.channel.name.replace("🚀 Partida ", "");

		let channel_text = oldState.guild.channels.cache.find(
			(ch) => ch.name === "💬chat-partida-" + partida_number
		);

		if (channel_text) {
			channel_text.updateOverwrite(newState.member.id, {
				SEND_MESSAGES: false,
				VIEW_CHANNEL: false,
			});
		}
	}
});
