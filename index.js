const Discord = require("discord.js");
const fs = require("fs")
const client = new Discord.Client();
let prefix = "!"
let ListWarns = JSON.parse(fs.readFileSync('./warns.json', 'utf8'));

client.login(process.env.TOKEN);

client.on("ready", () => {
    console.log("Prêt")
    client.user.setActivity("les vacances jusqu'au 26😀",{type: "WATCHING"});
});


client.on("message", message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    let args = message.content.trim().split(/ +/g);

    if (args[0].toLowerCase() === prefix + "nonfonctionel") {
        message.delete();
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(":x: Vous n'avez pas les permissions.")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Erreur d'utilisation : `!petiban @member temps`.")
        let bantime = message.content.split(" ").slice(2).join(" ");
        if (!bantime) return message.channel.send("Erreur d'utilisation : `!petiban @member temps`.")
        if (!Number(bantime)) return message.channel.send("Erreur d'utilisation : `!petiban @member temps`.")
        if (bantime < 1) return message.channel.send("Erreur, la durée du bannissement doit être **1 jour** au minimum.")
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner) return message.channel.send("Vous ne pouvez pas bannir ce membre.")
        if (!member.bannable) return message.channel.send("Vous ne pouvez pas bannir ce membre.")
        member.send("Vous êtes temporairement banni du serveur **" + message.guild.name + "** par le modérateur **" + message.author.username + "** pendant " + bantime + " jours.")
        message.guild.ban(member, { days: bantime })
        message.channel.send(`**${member.user.username}** est temporairement banni du serveur, pendant ${bantime} jours`);

    }

    if (args[0].toLowerCase() === prefix + "avertir") {
        message.delete();
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.author.send(":x: Vous n'avez pas la permission.");
        if (message.mentions.members.size !== 1) return message.author.send("Erreur d'utilisation : ``!avertir @member raison``.");

        var mentionned = message.mentions.members.first();
        if (args.length < 2) return message.author.send("Erreur d'utilisation : ``!avertir @member raison``.")

        let date = new Date().toDateString();
        if (ListWarns[message.guild.id] === undefined) ListWarns[message.guild.id] = {};
        if (ListWarns[message.guild.id][mentionned.id] === undefined) ListWarns[message.guild.id][mentionned.id] = [];

        let aver = { "raison": args.slice(2).join(' '), "time": date, "modo": message.author.id }
        ListWarns[message.guild.id][mentionned.id].push(aver);
        message.channel.send(`**${mentionned.user.username}** a été averti pour la raison suivante : **${args.slice(2).join(" ")}**`)
        let ListWarnsR = JSON.stringify(ListWarns)
        fs.writeFileSync('./warns.json', ListWarnsR, "UTF-8")
        mentionned.user.send(`**Avertissement dans le serveur ${message.guild.name} : \n\n  par le Modérateur : ${message.author.username}  \n Raison : ${args.slice(2).join(" ")}**`)
    }

    if (args[0].toLowerCase() === prefix + "affichagewarn") {
        message.delete();

        if (!message.member.hasPermission("BAN_MEMBERS")) return message.author.send(":x: Vous n'avez pas la permission.");

        if (message.mentions.members.size !== 1) return message.author.send("Erreur d'utilisation : ``!affichagewarn @member``.");
        var mentionned = message.mentions.members.first();

        if (ListWarns[message.guild.id] === undefined) return message.channel.send("**" + mentionned.user.tag + "** n'a aucun avertisstements.");
        if (ListWarns[message.guild.id][mentionned.id] === undefined) return message.channel.send("**" + mentionned.user.tag + "** n'a aucun avertissements.");

        let embed = new Discord.RichEmbed()
            .setTitle(`**${mentionned.user.tag}**  a été averti  **` + ListWarns[message.guild.id][mentionned.id].length + "** fois :eyes:")
            .setColor("#0a0a09")

        for (var i = 0; i < ListWarns[message.guild.id][mentionned.id].length; i++) {
            if (i > 19) break;
            iWarn = ListWarns[message.guild.id][mentionned.id][i]
            embed.addField(i + 1 + " • Donné par " + message.guild.members.get(iWarn["modo"]).user.tag + " - " + iWarn["time"] + " :", iWarn["raison"], true)
        }
        message.channel.send(embed);
    }

    if (args[0].toLowerCase() === prefix + "botparle") {
        message.delete();
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":x: Vous n'avez pas la permission.");
        let asend = message.content.split(" ").slice(1).join(" ")
        if (!asend) return message.channel.send("Erreur d'utilisation : `!botparle {texte}`")
        message.channel.send(asend);
    }

    if (args[0].toLowerCase() === prefix + "deux") {
        message.delete()
         if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":x: Vous n'avez pas la permission.")
        let chan1 = message.content.split(" ").slice(1, 2).join(" ");
        if (!chan1) return message.channel.send("Erreur : `!deux [id du salon 1] [id du salon 2] [message]`.")
        let chan2 = message.content.split(" ").slice(2, 3).join(" ");
        if (!chan2) return message.channel.send("Erreur : `!deux [id du salon 1] [id du salon 2] [message]`.")
        let content = message.content.split(" ").slice(3).join(" ");
        if (!content) return message.channel.send("Erreur : `!deux [id du salon 1] [id du salon 2] [message]`.")
        client.channels.get(chan1).send(content)
        client.channels.get(chan2).send(content)
        message.channel.send("✅ Les messages ont été envoyés.")
    }

    if (args[0].toLowerCase() === prefix + "aide") {
        message.delete();
        message.channel.send("***✅Commande d'aide !***");
        message.channel.send("**!botparle**:me fait parler!*(uniquement disponible pour les admins(pour le moment)*");
        message.channel.send("**!avertir**: averti un élève");
        message.channel.send("**!ticket**: ouvre un ticket d'aide (pas encore fonctionnel)");
        message.channel.send("**!petitban**: banni temporairement un élève *(sujet à la casse)*");
        message.channel.send("**!newcours**: quand je suis indisponible,prévient qu'un cours à été déposé.");
        message.channel.send("*!démocratie : surprise😉*");
        message.channel.send("*!aide : affiche toutes les commandes*");
        message.channel.send("*!dictature: tu veux vraiment essayer ?*");
        message.channel.send("**D'autres commandes arrivent très vite !**");

    }
    if (args[0].toLowerCase() === prefix + "mehdi") {
        message.delete();
        message.channel.send("*⛔️NON!⛔️*");
        message.channel.send("Tu ne dois pas parler de lui");
        message.channel.send("il est beau mais c'est  pas une raison");
        message.channel.send("**STOP!**");


    }
    if (args[0].toLowerCase() === prefix + "démocratie") {
        message.delete();
        message.channel.send("*⛔️NON!⛔️*");
        message.channel.send("Tu es en démocratie,ne l'oublie pas");
        message.channel.send("Tes droits sont limités car tu n'es pas seul!");
        message.channel.send("**STOP!**");
        mentionned.user.send(`**Avertissement: Stop**`);


    }
    if (args[0].toLowerCase() === prefix + "dictature") {
        message.delete();
        message.channel.send("*⛔️NON!⛔️*");
        message.channel.send("Tu n'es pas en dictature,ne dis plus jamais ça");
        message.channel.send("**STOP!**");


    }
    if (args[0].toLowerCase() === prefix + "ticket") {
        message.delete();
        message.channel.send("*⛔️Cette fonctionalité n'est pas encore disponible, en attendant, tu peux créer un ticket en faisant -new (raison). Clément essaie de résoudre ce problème le plus rapidement possible mais à d'autres choses à faire aussi.⛔️*");


    }
    if (args[0].toLowerCase() === prefix + "petitban") {
        message.delete();
        message.channel.send("*⛔️Cette fonctionalité n'est pas encore disponible, en attendant, fais !tempban et utilise mee6. Clément fais de son mieux pour résoudre ces problèmes⛔️*");


    }
    if (args[0].toLowerCase() === prefix + "t") {
        message.delete();
        message.channel.send("*⛔️Cette fonctionalité n'est pas encore disponible, en attendant, tu peux créer un ticket en faisant -new (raison). Clément essaie de résoudre ce problème le plus rapidement possible mais à d'autres choses à faire aussi.⛔️*");


    }




    if (message.content.startsWith(prefix + "test")) {
        message.delete()
        const reason = message.content.split(" ").slice(1).join(" ");
        if (!reason) return message.channel.send('Erreur d\'utilisation : `!ticket {raion}`.');
        if (!message.guild.roles.exists("name", "🚔Modérateur🚔")) return message.channel.send(`Erreur : ce serveur ne possède pas le rôle **🚔Modérateur🚔**.`);
        if (!message.guild.roles.exists("name", "⚡️Admin⚡️")) return message.channel.send(`Erreur : ce serveur ne possède pas le rôle **⚡️Admin⚡️**.`);
        if (message.guild.channels.exists("name", `ticket-${message.author.username}`)) return message.channel.send(`Erreur : un salon existe déjà pour vous.`);
        message.guild.createChannel(`ticket-${message.author.username}`, "text").then(c => {
            let role = message.guild.roles.find("name", "🚔Modérateur🚔");
            let role2 = message.guild.roles.find("name", "@everyone");
            let role3 = message.guild.roles.find("name", "⚡️Admin⚡️")
            c.overwritePermissions(role, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });
            c.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role3, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            message.channel.send(`Salon ouvert : <#${c.id}>.`);
            const embed = new Discord.RichEmbed()
                .addField(`Hey ${message.author.username}!`, `Tu as ouvert ton ticket pour cette raison : \n ${reason}, nous allons nous occuper de toi!`)
                .setTimestamp();
            c.send(embed);

        }).catch(console.error);
    }

    if (message.content.startsWith(prefix + "fini")) {
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Vous ne pouvez pas fermer votre salon en dehors de celui-ci..`);
        message.channel.send(`Êtes-vous sûr de vouloir fermer le salon? Pour confirmer sa fermeture, écrivez \`fermeture\``)
            .then((m) => {
                message.channel.awaitMessages(response => response.content === 'fermeture', {
                    max: 1,
                    time: 40000,
                    errors: ['time'],
                })
                    .then((collected) => {
                        message.channel.delete();
                    })
                    .catch(() => {
                        m.edit('La fermeture du ticket a été annulé.').then(m2 => {
                            m2.delete();
                        }, 3000);
                    });
            });
    }

    if (message.content === prefix + "off") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":x: Vous n'avez pas la permission de me tuer.")
        message.delete()
        message.channel.send("**⚙ Arrêt en cours, veuillez patientez...**")
        message.channel.send("**Je suis désormais éteint,merci de ta patience,Clément **").then(async () => {
            console.log('Hors-ligne');
            await client.destroy();
            await process.exit()
            

        });
    }

    if (args[0].toLowerCase() === prefix + 'petitcoupeparole') {
        message.delete()
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":x: Vous n'avez pas la permission.");
        let member = message.mentions.members.first();
        if (!member) return message.channel.send(`Erreur d'utilisation : \`!petitcoupeparole @member temps raison\``);
        if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send(':x: Vous n\'avez pas la permission.');
        if (member.highestRole.calculatedPosition >= member.guild.me.highestRole.calculatedPosition || member.user.id === member.guild.owner.id) return message.channel.send(":x: Je n'ai pas la permission.");
        let mutetime = args.slice(2, 3).join(' ').toLowerCase();
        if (!mutetime) return message.channel.send(`Erreur d'utilisation : \`!petitcoupeparole @member temps raison\``);
        let raison = args.slice(3).join(' ').toLowerCase();
        if (!raison) return message.author.send(`Erreur d'utilisation : \`!petitcoupeparole @member temps raison\``);
        let muterole = message.guild.roles.find(role => role.name === 'Muted');
        if (!muterole) {
            muterole = message.guild.createRole({
                name: "Muted",
                color: "#000002",
                permissions: []
            }).then((role) => {
                message.guild.channels.forEach((channel) => {
                    channel.overwritePermissions(role.id, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        CONNECT: false,
                        SPEAK: false,
                        SEND_TTS_MESSAGES: false,
                    });
                });
                member.addRole(role.id);
                message.channel.send(`${member} est maintenant mute pendant **${ms(ms(mutetime))}** pour la raison suivante : **${raison}**.`);
                member.send(`Vous êtes mute temporairement du serveur **${message.guild.name}** pendant **${mutetime}**, pour la raison suivante : **${raison}**.`);
                timeoutID = setTimeout(function () {
                    member.removeRole(role.id);
                    message.channel.send(`${member} n'est plus mute!`);
                }, ms(mutetime));
            })
        } else {
            member.addRole(muterole.id);
            message.channel.send(`${member} est maintenant mute pendant **${ms(ms(mutetime))}** pour la raison suivante : **${raison}**.`);
            member.send(`Vous êtes mute temporairement du serveur **${message.guild.name}** pendant **${mutetime}**, pour la raison suivante : **${raison}**.`);
            timeoutID = setTimeout(function () {
                member.removeRole(muterole.id);
                message.channel.send(`${member} n'est plus mute!`);
            }, ms(mutetime));
        }
    }

});

client.on("error", err => {
    if (err) console.log(err)
})

