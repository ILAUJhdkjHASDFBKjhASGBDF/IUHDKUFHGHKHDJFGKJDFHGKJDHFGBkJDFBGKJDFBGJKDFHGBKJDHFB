const Discord = require('discord.js');
const client = new Discord.Client()
var moment = require('moment');
const fs = require("fs");
const mysql = require("mysql");




var connection=mysql.createConnection({
    host     : '178.63.47.105',
    user     : 'u833_QAEc9z1JFB',
    password : 'nL4FViBTMZ9G8n^ZQ^F!B2^G',
    database : 's833_Db1'
});

connection.connect(err => {
    if(err) throw err;
    else{
        console.log(`connected to db`)
    }
   })
 
async function login() {
    try {
      await client.login(``)
    } catch (err) {
        console.log(`INVALIID TOKEN`)
        setTimeout(function() {
        process.exit()
    }, 10000);

    }
  }
  
  login();
  client.on('guildMemberAdd', member => {    
try{
    let buyerRole = member.guild.roles.find(role => role.id == "745172056404131871")
    let testerRole = member.guild.roles.find(role => role.id == "745172901803720786")
    let staffRole = member.guild.roles.find(role => role.id == "746279540191526913")

    connection.query(`SELECT * FROM VerifiedUsers WHERE UserID = '${member}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length !== 1) return member.send(`Thank you for choosing Oriun. Please verify by opening a ticket and sending \`\`!verify <your Key>\`\``)
        if(rows.length == 1) {
            let typekey = rows[0].license 
    connection.query(`SELECT * FROM Users WHERE licensekey = '${typekey}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length!== 1) return
        if(rows.length == 1){
        let keyversion = rows[0].version 
            if (keyversion == 'revoked') return member.send(`Your key is invalid as it was revoked.`)  
            member.addRole(buyerRole)
            if (keyversion == 'tester') member.addRole(testerRole)
            if (keyversion == 'staff') member.addRole(staffRole)
            member.send(`You have been verified automatically`)
            connection.query(`INSERT INTO Events (User, ID, Event, Time) VALUES ('${member.user.tag}', '${member.id}', 'Was verified automatically', '${moment(Date.now()).format("YYYY-MM-DD kk:mm:ss")}')`)
  }
})
       
    }
})
} catch (err) {
    client.users.get("260027131562688524").send(`\`\`\`${err}\`\`\``);
    }  
})
  
  client.on("ready", async () => { 
    const interval = setInterval(UpdateChannelKeys, 240000);
    function UpdateChannelKeys(){
     connection.query(`SELECT * FROM Users`, (err, rows) => {
         if(err) throw err;
         let serverStats = {
            TotalKeysChannel: "746442700450168948",
        }
            client.channels.get(serverStats.TotalKeysChannel).setName(`𝐓𝐨𝐭𝐚𝐥𝐋𝐢𝐜𝐞𝐧𝐬𝐞𝐬 : ${rows.length}`);
        })
         connection.query(`SELECT * FROM Logging`, (err, rows) => {
            if(err) throw err;
     let serverStats = {
         TotalLoggings: "746473561543409675"
     };
     setTimeout(function() {
     client.channels.get(serverStats.TotalLoggings).setName(`𝐋𝐨𝐠𝐢𝐧𝐬 : ${rows.length}`);
    }, 10000);
})
    }
})
    client.on("message", async message => {
        try {

            if(message.content.startsWith(`!userinfo`)) {
                message.react("👍")
                message.reply(`I have messaged you your Oriun statistics.`)
                connection.query(`SELECT * FROM VerifiedUsers WHERE UserID = '${message.author}'`, (err, rows) => {
                    if(!rows) return message.channel.send(`Key doesn't exist. Or records don't exist.`)
                    if(err) throw err;
                    let sql;
                    let key = rows[0].license
                    if (!key) return message.reply(`Could not find your key`)
                    if(rows) {
                    connection.query(`SELECT * FROM Logging WHERE license = '${key}'`, (err, rows) => {
                        if(err) throw err;
                        if(!rows) return message.channel.send(`Key doesn't exist. Or records don't exist.`)
                        let sql;
                        let numofloggins = rows.length
                        if(rows) {
                            connection.query(`SELECT * FROM Users WHERE licensekey = '${key}'`, (err, rows) => {
                                if(err) throw err;
                                if(!rows) return message.channel.send(`Key doesn't exist. Or records don't exist.`)
                                let sql;
                                let hwid = rows[0].hwid
                                let version = rows[0].version
                                if (!hwid) return message.reply(`Could not find your hwid`)
                                if (!version) return message.reply(`Could not find your version`)
                                if(rows) {
                            const oriunstatsEmbed = new Discord.RichEmbed()
                            .setColor(1752220)
                            .setTitle(`Results for ${message.author.tag}`)
                            .addField(`Log ins`, `\`\`${numofloggins}\`\``, true)
                            .addField(`Key`, `\`\`${key}\`\``, true)
                            .addField(`Hwid`, `\`\`${hwid}\`\``, true)
                            .addField(`Account Type`, `\`\`${version}\`\``, true)
                            .addField(`Verified`, `\`\`True\`\``, true)

                            message.author.send({embed: oriunstatsEmbed})
                        }
                    })
                }
            })
                    }
                })
                }
                if(message.content.startsWith(`!hwid reset`)) {
                    
                    if (message.channel.type !== 'dm') message.channel.send(`Please do not use this in a guild. Dm me the info instead.`)
                    if (message.channel.type !== 'dm')return message.delete()
                    let prefix = '!'
                    let args = message.content.slice(prefix.length).trim().split(/ +/g);
                    let key = args[2]
                    let reason = args.slice(3).join(" ");

                    const hwidresethook = new Discord.WebhookClient(`747071644610068521`, `DH1KG16Dv0XV1PYMUSKpwyiKpOFs0Bl2Glhn9JeVA83nz9QPVXtRScxrXvYNHjuuBsuO`);
                    const hwidresetEmbed1 = new Discord.RichEmbed()
                    .setColor(1752220)
                    .setTitle(`Hwid reset ticket`)
                    .setDescription(`Ticket submitted by ${message.author.tag} id | \`\`${message.author.id}\`\``)
                    .addField(`Ticket Type`, `Hwid reset request`)
                    .addField(`Key`, `| ${key} |`, true)
                    .addField(`Reason`, `| ${reason} |`, true)
                    hwidresethook.send({embeds: [hwidresetEmbed1]})
                    hwidresethook.send(`@everyone`)
                    const hwidresetEmbed = new Discord.RichEmbed()
                    .setColor(1752220)
                    .setTitle(`Hwid reset ticket`)
                    .setDescription(`Thank you for contacting support. You're ticket has been submitted to staff who will get back to you soon.\n**Ticket Details**`)
                    .addField(`Ticket Type`, `Hwid reset request`)
                    .addField(`Key`, `${key}`, true)
                    .addField(`Reason`, `${reason}`, true)
                    message.channel.send({embed: hwidresetEmbed})
                }

                if(message.content.startsWith(`!key issue`)) {
                    
                    if (message.channel.type !== 'dm') message.channel.send(`Please do not use this in a guild. Dm me the info instead.`)
                    if (message.channel.type !== 'dm')return message.delete()
                    let prefix = '!'
                    let args = message.content.slice(prefix.length).trim().split(/ +/g);
                    let key = args[2]
                    let issue = args.slice(3).join(" ");
                    if (!issue) return message.reply(`Please add a key and issue`)

                    
                    const keyissueEmbed = new Discord.RichEmbed()
                    .setColor(1752220)
                    .setTitle(`Key issue ticket`)
                    .setDescription(`Thank you for contacting support. You're ticket has been submitted to staff who will get back to you soon.\n**Ticket Details**`)
                    .addField(`Ticket Type`, `Key issue`)
                    .addField(`Key`, `${key}`, true)
                    .addField(`Issue`, `${issue}`, true)
                    message.channel.send({embed: keyissueEmbed})

                    const hwidresethook = new Discord.WebhookClient(`747071644610068521`, `DH1KG16Dv0XV1PYMUSKpwyiKpOFs0Bl2Glhn9JeVA83nz9QPVXtRScxrXvYNHjuuBsuO`);
                    const keyissueEmbed1 = new Discord.RichEmbed()
                    .setColor(1752220)
                    .setTitle(`Key issue ticket`)
                    .setDescription(`Ticket submitted by ${message.author.tag} id | \`\`${message.author.id}\`\``)
                    .addField(`Ticket Type`, `key issue`)
                    .addField(`Key`, `| ${key} |`, true)
                    .addField(`issue`, `| ${issue} |`, true)
                    hwidresethook.send({embeds: [keyissueEmbed1]})
                    hwidresethook.send(`@everyone`)
                }
                if(message.content.startsWith(`!oriun issue`)) {
                    
                    if (message.channel.type !== 'dm') message.channel.send(`Please do not use this in a guild. Dm me the info instead.`)
                    if (message.channel.type !== 'dm')return message.delete()
                    let prefix = '!'
                    let args = message.content.slice(prefix.length).trim().split(/ +/g);
                    let key = args[2]
                    let issue = args.slice(3).join(" ");
                    if (!issue) return message.reply(`Please add a key and issue`)

                    
                    const keyissueEmbed = new Discord.RichEmbed()
                    .setColor(1752220)
                    .setTitle(`Oriun issue ticket`)
                    .setDescription(`Thank you for contacting support. You're ticket has been submitted to staff who will get back to you soon.\n**Ticket Details**`)
                    .addField(`Ticket Type`, `Oriun issue`)
                    .addField(`Key`, `${key}`, true)
                    .addField(`Issue`, `${issue}`, true)
                    message.channel.send({embed: keyissueEmbed})

                    const hwidresethook11 = new Discord.WebhookClient(`747071644610068521`, `DH1KG16Dv0XV1PYMUSKpwyiKpOFs0Bl2Glhn9JeVA83nz9QPVXtRScxrXvYNHjuuBsuO`);
                    const keyissueEmbed1 = new Discord.RichEmbed()
                    .setColor(1752220)
                    .setTitle(`Oriun issue ticket`)
                    .setDescription(`Ticket submitted by ${message.author.tag} id | \`\`${message.author.id}\`\``)
                    .addField(`Ticket Type`, `Oriun issue`)
                    .addField(`Key`, `| ${key} |`, true)
                    .addField(`issue`, `| ${issue} |`, true)
                    hwidresethook11.send({embeds: [keyissueEmbed1]})
                    hwidresethook11.send(`@everyone`)
                }

            if (message.channel.type == 'dm') return
            if (message.guild.id === '745171801675530280'){
            if(message.content.startsWith(`o!genkey`)) {
                if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`Bitch you thought lmfao`) 
                        var numbers1 = ["1", "2", "3", "4", "5", "6","7", "8", "9"];
                        var numbers2 = ["1", "2", "3", "4", "5", "6","7", "8", "9"];
                        var numbers3 = ["1", "2", "3", "4", "5", "6","7", "8", "9"];
                        var letters4 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters5 = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
                        var letters6 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters7 = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
                        var letters8 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters9 = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
                        var letters10 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters11 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters12 = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
                        var letters13 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters14 = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
                        var letters15 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters16 = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
                        var letters17 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters18 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters19 = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
                        var letters20 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters21 = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
                        var letters22 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];
                        var letters23 = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",];
                        var letters24 = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",];

                        let lett1 = `${numbers1[Math.floor(Math.random()*numbers1.length)]}`;
                        let lett2 = `${numbers2[Math.floor(Math.random()*numbers2.length)]}`;
                        let lett3 = `${numbers3[Math.floor(Math.random()*numbers3.length)]}`;
                        let lett4 = `${letters4[Math.floor(Math.random()*letters4.length)]}`;
                        
                        let lett5 = `${letters5[Math.floor(Math.random()*letters5.length)]}`;
                        let lett6 = `${letters6[Math.floor(Math.random()*letters6.length)]}`;
                        let lett7 = `${letters7[Math.floor(Math.random()*letters7.length)]}`;
                        let lett8 = `${letters8[Math.floor(Math.random()*letters8.length)]}`;
                        
                        let lett9 = `${letters9[Math.floor(Math.random()*letters9.length)]}`;
                        let lett10 = `${letters10[Math.floor(Math.random()*letters10.length)]}`;
                        let lett11 = `${letters11[Math.floor(Math.random()*letters11.length)]}`;
                        let lett12 = `${letters12[Math.floor(Math.random()*letters12.length)]}`;
                        
                        let lett13 = `${letters13[Math.floor(Math.random()*letters13.length)]}`;
                        let lett14 = `${letters14[Math.floor(Math.random()*letters14.length)]}`;
                        let lett15 = `${letters15[Math.floor(Math.random()*letters15.length)]}`;
                        let lett16 = `${letters16[Math.floor(Math.random()*letters16.length)]}`;
                        
                        let lett17 = `${letters17[Math.floor(Math.random()*letters17.length)]}`;
                        let lett18 = `${letters18[Math.floor(Math.random()*letters18.length)]}`;
                        let lett19 = `${letters19[Math.floor(Math.random()*letters19.length)]}`;
                        let lett20 = `${letters20[Math.floor(Math.random()*letters20.length)]}`;
                        
                        let lett21 = `${letters21[Math.floor(Math.random()*letters21.length)]}`;
                        let lett22 = `${letters22[Math.floor(Math.random()*letters22.length)]}`;
                        let lett23 = `${letters23[Math.floor(Math.random()*letters23.length)]}`;
                        let lett24 = `${letters24[Math.floor(Math.random()*letters24.length)]}`;

                        let gennedlicense = `${lett1}${lett5}${lett6}${lett7}-${lett2}${lett8}${lett9}${lett4}-${lett10}${lett24}${lett23}${lett3}-${lett11}${lett12}${lett13}${lett16}-${lett15}${lett14}${lett22}${lett21}-${lett17}${lett18}${lett19}${lett20}`
                        connection.query(`INSERT INTO Users (licensekey, hwid, version, expiry) VALUES ('${gennedlicense}', '', 'purchased', '0000-00-00')`);
                        message.channel.send(`\`\`${gennedlicense}\`\``)
                       console.log(`${message.author.tag} generated the key ${gennedlicense}`)
                        const hook2 = new Discord.WebhookClient(`746096634277920809`, `8ZOTAO6qEWjLIIOQR1pZu4OzCIvkkv0MX_nPRa5gFsN0tAXLfupH1AK7fxYJiku97fSE`);
                        const genkey = new Discord.RichEmbed()
                        .setColor(15105570)
                        .setTitle(`Oriun Bot`)
                        .setDescription(`${message.author.tag} generated ${gennedlicense}`)
                        hook2.send({embeds: [genkey]});
                        connection.query(`INSERT INTO Events (User, ID, Event, Time) VALUES ('${message.author.tag}', '${message.author.id}', 'Generated ${gennedlicense}', '${moment(Date.now()).format("YYYY-MM-DD kk:mm:ss")}')`)   
                    
                    }  

            const prefix = 'o!'
            let args = message.content.slice(prefix.length).trim().split(/ +/g);
            if(message.content.startsWith(`o!addkey`)) {
                if (!message.member.hasPermission('ADMINISTRATOR')){
                    return message.channel.send(`Bitch you thought lmfao`)
                       }else{
                        let addedkey = args[1]
                        if(!addedkey) return message.channel.send(`Please include a key`)
                        connection.query(`INSERT INTO Users (licensekey, hwid, version, expiry) VALUES ('${addedkey}', '', 'purchased', '0000-00-00')`);
                        message.channel.send(`Added [\`\`${addedkey}\`\`]`)
                        const hook2 = new Discord.WebhookClient(`746096634277920809`, `8ZOTAO6qEWjLIIOQR1pZu4OzCIvkkv0MX_nPRa5gFsN0tAXLfupH1AK7fxYJiku97fSE`);
                        const addedkeyEmbed = new Discord.RichEmbed()
                        .setColor(1752220)
                        .setTitle(`Oriun Bot`)
                        .setDescription(`${message.author.tag} added ${addedkey}`)
                        hook2.send({embeds: [addedkeyEmbed]});
                        connection.query(`INSERT INTO Events (User, ID, Event, Time) VALUES ('${message.author.tag}', '${message.author.id}', 'Added ${addedkey}', '${moment(Date.now()).format("YYYY-MM-DD kk:mm:ss")}')`)   
                       }
                    } 
            if(message.content.startsWith(`o!verify`)) {
                if (!message.member.hasPermission('ADMINISTRATOR')){
                    return
                       }else{
            let user = message.mentions.members.first();
            let key = args[2]
            if (!args[1]) return message.channel.send(`Please mention a user aswell as a key`)
            if (!args[2]) return message.channel.send (`Please add a key`)
            try {
                connection.query(`SELECT * FROM Users WHERE licensekey = '${key}'`, (err, rows) => {
                    if(err) throw err;
                    let sql;
                    if(rows.length !== 1) return message.channel.send(`Key doesn't exist`)
                    if(rows.length == 1) {
                        let status = rows[0].version 
                connection.query(`SELECT * FROM VerifiedUsers WHERE license = '${key}'`, (err, rows) => {
                    if(err) throw err;
                    let sql;
                    if(rows.length == 1){
                    let mmm = rows[0].UserID 
                    return message.channel.send(`Key in use by ${mmm}`)
                    }else{
                        connection.query(`SELECT * FROM VerifiedUsers WHERE UserID = '${user}'`, (err, rows) => {
                            if(err) throw err;
                            let sql;
                            if(rows.length == 1){
                            return message.channel.send(`This account is already in the database`)
                            }else{
                        let buyerRole = message.guild.roles.find(role => role.id == "745172056404131871")
                        let testerRole = message.guild.roles.find(role => role.id == "745172901803720786")
                        let staffRole = message.guild.roles.find(role => role.id == "746279540191526913")
                        if (status == 'revoked') return message.channel.send(`Your key is invalid as it was revoked.`)    
                        user.addRole(buyerRole)
                        if (status == 'tester') user.addRole(testerRole)
                        if (status == 'staff') user.addRole(staffRole)
                        connection.query(`INSERT INTO VerifiedUsers (UserID, license) VALUES ('${user}', '${key}')`)
                        message.channel.send(`Verified ${user}`)
                        console.log(`${message.author.tag} verified ${user}`)
                    }
                })
            }
            })   
             
            }
            
            }) 
                
        
        } catch (err) {
            console.log(err)
        }
    }
}
            
if(message.content.startsWith(`!verify`)) {
let key = args[1]
let user = message.mentions.members.first();
if (!args[1]) return message.channel.reply (`Please include a key`)
try {
    connection.query(`SELECT * FROM Users WHERE licensekey = '${key}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length !== 1){ const Revoked = new Discord.RichEmbed() .setColor(1752220).setTitle(`The key __${args[1]}__ does not exist`); return message.channel.send({embed: Revoked})}
        if(rows.length == 1) {
            let status = rows[0].version 
    connection.query(`SELECT * FROM VerifiedUsers WHERE license = '${key}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length == 1){
            client.users.get("747560428233818132").send(`${message.author.tag} tried to verify themself with the key __${key}__`);
            const Revoked = new Discord.RichEmbed() .setColor(1752220).setTitle(`The key __${args[1]}__ is in use`); return message.channel.send({embed: Revoked});
        }else{
            
            connection.query(`SELECT * FROM VerifiedUsers WHERE UserID = '${user}'`, (err, rows) => {
                if(err) throw err;
                let sql;
                if(rows.length == 1){
                 const Revoked = new Discord.RichEmbed() .setColor(1752220).setTitle(`This account is already in the database`); return message.channel.send({embed: Revoked})
                }else{
            let buyerRole = message.guild.roles.find(role => role.id == "745172056404131871")
            let testerRole = message.guild.roles.find(role => role.id == "745172901803720786")
            let staffRole = message.guild.roles.find(role => role.id == "746279540191526913")
            if (status == 'revoked') {const Revoked = new Discord.RichEmbed() .setColor(1752220).setTitle(`The key __${args[1]}__ is invalid as it was revoked.`); return message.channel.send({embed: Revoked})}
            message.member.addRole(buyerRole)
            if (status == 'tester') message.member.addRole(testerRole)
            if (status == 'staff') message.member.addRole(staffRole)
            connection.query(`INSERT INTO VerifiedUsers (UserID, license) VALUES ('${message.author}', '${key}')`)
            message.channel.send(`\`\`\`Verification successfull\`\`\``)
            const Revoked = new Discord.RichEmbed()
                                .setColor(1752220)
                                .setTitle(`Oriun Bot`)
                                .setDescription(`You have been verified on \`\`Oriun Community Discord\`\``)
                                .addField(`Key`, `__${key}__`, true)
                                .addField(`Account type`, `${status}`, true)
                                message.author.send({embed: Revoked})
                                client.users.get("747560428233818132").send(`${message.author.tag} verified themself with the key __${key}__`);
            console.log(`${message.author.tag} was verified`)
        }
    })
}
})   
 
}

}) 
    

} catch (err) {
console.log(err)
}
}

if(message.content.startsWith(`o!userlookup`)) {
    if (!message.member.hasPermission('ADMINISTRATOR')){
        return
           }else{
let user = message.mentions.members.first();
if (!user) return message.channel.send (`Please mention a user`)
try {
    connection.query(`SELECT * FROM VerifiedUsers WHERE UserID = '${user}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length !== 1) return message.channel.send(`User not in database`)
        if(rows.length == 1) {
        let keyregistered = rows[0].license 
    connection.query(`SELECT * FROM Users WHERE licensekey = '${keyregistered}'`, (err, rows) => {
        if(err) throw err;
        let sql;
        if(rows.length == 0)return
        let KeyStatus = rows[0].version
        let hwidregistered = rows[0].hwid
            connection.query(`SELECT * FROM Logging WHERE license = '${keyregistered}' ORDER BY time DESC`, (err, rows) => {
                if(err) throw err;
                let sql;
                let lastip = rows[0].ip
                let laststatus = rows[0].status
                let time = rows[0].time
                const lookupEmbed = new Discord.RichEmbed()
                .setColor(15105570)
                .setTitle(`Results for ${user}`)
                .addField(`Key Registered`, `>${keyregistered}<`, true)
                .addField(`Version`, `>${KeyStatus}<`, true)
                .addField(`HWID`, `>${hwidregistered}<`, true)
                .addField(`ip of last login`, `>${lastip}<`, true)
                .addField(`Result of last login`, `>${laststatus}<`, true)
                .addField(`Time of last login`, `>${time}<`, true)
                message.channel.send({embed: lookupEmbed})
                console.log(`${message.author.tag} looked up ${user.tag}`)
        
            })
        })
    }
})

    

} catch (err) {
console.log(err)
}
}
}

               if(message.content.startsWith(`o!revokekey`)) {
                if (!message.member.hasPermission('ADMINISTRATOR')){
                    return message.channel.send(`Bitch you thought`)
                       }else{
                        let keytorevoke = args[1]
                        if (!keytorevoke) return message.channel.send(`Please include a key`)
                        connection.query(`UPDATE Users SET version = 'revoked' WHERE licensekey= '${keytorevoke}'`)
                        const Revoked = new Discord.RichEmbed()
                        .setColor(1752220)
                        .setTitle(`Oriun Bot`)
                        .setDescription(`Successfully revoked key \`\`${keytorevoke}\`\``)
                        message.channel.send({embed: Revoked})
                        connection.query(`INSERT INTO Events (User, ID, Event, Time) VALUES ('${message.author.tag}', '${message.author.id}', 'Revoked ${keytorevoke}', '${moment(Date.now()).format("YYYY-MM-DD kk:mm:ss")}')`)      
                    }
                    } 
                    
                    if(message.content.startsWith(`o!resethwid`)) {
                        if (!message.member.hasPermission('ADMINISTRATOR'))return message.channel.send(`Bitch you thought`)
                                let keytoreset = args[1]
                                connection.query(`UPDATE Users SET hwid = '' WHERE licensekey= '${keytoreset}'`)
                                const Revoked = new Discord.RichEmbed()
                                .setColor(1752220)
                                .setTitle(`Oriun Bot`)
                                .setDescription(`Successfully reset hwid for \`\`${keytoreset}\`\``)
                                message.channel.send({embed: Revoked})
                                console.log(`${message.author.tag} reset hwid for ${keytoreset}`)
                                connection.query(`INSERT INTO Events (User, ID, Event, Time) VALUES ('${message.author.tag}', '${message.author.id}', 'Reset hwid for ${keytoreset}', '${moment(Date.now()).format("YYYY-MM-DD kk:mm:ss")}')`)      
                            } 
                            if(message.content.startsWith(`setupverification`)) {
                                if (!message.member.hasPermission('ADMINISTRATOR'))return message.channel.send(`Bitch you thought`)
                                        const Revoked = new Discord.RichEmbed()
                                        .setColor(1752220)
                                        .setTitle(`__**Oriun Bot**__`)
                                        .setDescription(`To gain access to the discord. Please open a ticket by reacting to the above message and send \`\`!verify <key>\`\``)
                                        .addField(`__**Example**__`,`\`\`!verify bolt\`\``,)
                                        .setImage(`https://stellerpricemyass.cyou/-/rerra9.png`)
                                        message.channel.send({embed: Revoked})
                                    } 
                                    if(message.content.startsWith(`setupprices`)) {
                                        if (!message.member.hasPermission('ADMINISTRATOR'))return message.channel.send(`Bitch you thought`)
                                                const Revoked = new Discord.RichEmbed()
                                                .setColor(1752220)
                                                .setTitle(`__**Oriun prices**__`)
                                                .addField(`__**Lifetime**__`,`\`\`9$ - Lifetime\`\``,)
                                                .addField(`__**Reseller Prices**__`,`\`\`0-3 Keys - 7$ - Lifetime\`\`\n\`\`4-8 Keys - 5$ - Lifetime\`\`\n\`\`9-100 Keys - 4.5$ - Lifetime\`\``,)
                                                .setFooter(`https://shoppy.gg/@oriundiscordself OR #buy-oriun-here`)
                                                message.channel.send({embed: Revoked})
                                            }
                                            if(message.content.startsWith(`setuprules`)) {
                                                if (!message.member.hasPermission('ADMINISTRATOR'))return message.channel.send(`Bitch you thought`)
                                                        const Revoked = new Discord.RichEmbed()
                                                        .setColor(1752220)
                                                        .setTitle(`__**Oriun Rules**__`)
                                                        .setDescription(`\`\`1. No scamming\n2. No raiding\n3. No disrespect\n4. No advertising\n5. No gore/NSFW\n6. No Doxxing\n7. No attempting to interfear with/"dump" Oriun source\`\``)
                                                        .setFooter(`Abide by these rules or risk getting banned + potentially revoked`)
                                                        message.channel.send({embed: Revoked})
                                                    }
                                                    if(message.content.startsWith(`setupdownload`)) {
                                                        if (!message.member.hasPermission('ADMINISTRATOR'))return message.channel.send(`Bitch you thought`)
                                                                const Revoked = new Discord.RichEmbed()
                                                                .setColor(1752220)
                                                                .setTitle(`__**Oriun Download**__`)
                                                                .setDescription(`\`\`After Downloading. Follow the instructions in #setup-tutorial\`\``)
                                                                .addField(`Download`, `https://oriun.net/downloads/oriun.zip`)
                                                                .setFooter(`Oriun`)
                                                                message.channel.send({embed: Revoked})
                                                            }
                                                            if(message.content.startsWith(`setupsetuptutorial`)) {
                                                                if (!message.member.hasPermission('ADMINISTRATOR'))return message.channel.send(`Bitch you thought`)
                                                                        const Revoked = new Discord.RichEmbed()
                                                                        .setColor(1752220)
                                                                        .setTitle(`__**Oriun Tutorials**__`)
                                                                        .addField(`__**How to install Oriun**__`, `https://www.youtube.com/watch?v=Vc2G1QRok7A`)
                                                                        .addField(`__**How to update Oriun**__`, `https://www.youtube.com/watch?v=7vfiBUyAgp4`)
                                                                        .setFooter(`Oriun`)
                                                                        message.channel.send({embed: Revoked})
                                                                    }
                                                                    if(message.content.startsWith(`setupreferrals`)) {
                                                                        if (!message.member.hasPermission('ADMINISTRATOR'))return message.channel.send(`Bitch you thought`)
                                                                                const Revoked = new Discord.RichEmbed()
                                                                                .setColor(1752220)
                                                                                .setTitle(`__**Oriun Referrals**__`)
                                                                                .addField(`__**2 Referrals**__`, `1x 6month key`)
                                                                                .addField(`__**4 referrals**__`, `3x lifetime trial key`)
                                                                                .setFooter(`To redeem a referral. Contact an admin`)
                                                                                message.channel.send({embed: Revoked})
                                                                            }
                            if(message.content.startsWith(`o!help`)) {
                                if (!message.member.hasPermission('ADMINISTRATOR')) return
                                        const helpEmbed = new Discord.RichEmbed()
                                            .setColor(1752220)
                                            .setTitle(`Oriun Commands`)
                                            .setDescription(`o!verify <user> <key> | Verifies a user\no!revokekey <key> | Revokes a key\no!genkey | Generates a new key\no!resethwid <key> | Resets a keys hwid\no!addkey <keyname> | Adds a custom key to the database.`)
                                            message.channel.send({embed: helpEmbed})
                                        console.log(`${message.author.tag} asked for help`)
                                    }
                                    if(message.content.startsWith(`!help`)) {
                                                const userhelpEmbed = new Discord.RichEmbed()
                                                    .setColor(1752220)
                                                    .setTitle(`Oriun Commands`)
                                                    .setDescription(`!verify <key> | Verifies you.\n!userinfo | Shows your Oriun stats.`)
                                                    message.channel.send({embed: userhelpEmbed})
                                                console.log(`${message.author.tag} asked for help`)
                                            }

                                        }                                    
                                    } catch (err) {
                                        client.users.get("747560428233818132").send(`\`\`\`${err}\`\`\``);
                                        }
                                    })