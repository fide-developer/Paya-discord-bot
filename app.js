//import databases
let db = require("./DatabaseKata")

let dbclient = new db.DatabaseKata()

//require discord.js
const Discord = require("discord.js");

//create a new client using the  new keyword.
const client = new Discord.Client();

//const for setup the game
const initiategame = "psk mulai";
const joingame = "psk join";
const startgame = "psk start";
const endgame = "psk end";
const retreat = "psk ampun";
const maxJoinGame = 6;
const axios = require('axios')
//const for game status
var listPlayer = []


client.on("ready", ()=>{
    console.log(`Logged in as ${client.user.tag}`);
})

client.on("message", msg => {
    // console.log(msg.member.user.tag)
    // msg.channel.send("<@"+msg.member.id+">")
    //msg.channel.send("hallo @everyone")
        switch(msg.content.toLowerCase()){
            case initiategame:
                initGames(msg);
                break;
            //case joingame:
            //    joinGames(msg);
            //    break;
            //case startgame:
            //    startGames(msg);
            //    break;
            //case endgame:
            //    endGames(msg);
            //    break;
            //case retreat:
            //    retreatGames(msg);
            //    break;
            default:
                let inCommand = msg.content.split(" ");
                
                if(inCommand.length > 1 && inCommand[0].toLowerCase() === "psk"){
                    if(inCommand.length <= 2){
                        if(!(inCommand[0].toLowerCase() === "init" || inCommand[0].toLowerCase() === "join" || inCommand[0].toLowerCase() === "start" || inCommand[0].toLowerCase() === "ampun" || inCommand[0].toLowerCase() === "end" )){
                            msg.channel.send("Maaf sayang, aku ga ngerti nih! (~,~)");
                            break;
                        }
                    }else{
                        msg.channel.send("Maaf sayang, aku ga ngerti nih! (~,~)");
                        break;
                    }
                }
                break;
        }
});
function joinGames(msg,listJoin, id) {
    let alreadyJoin = false;
    
    if(listPlayer.length > 0){
        listPlayer.forEach((list) => {
            if(list === id){
                alreadyJoin = true;
            }
        });
    }
    
    if(!alreadyJoin){
        listPlayer.push(id);
        listJoin.push({
            id: id,
            life:5,
            reRoll:3,
            point:0,
            ready:true
        });
        
    }else{
        msg.reply("Kamu sudah masuk di room lain :wink:\nSilahkan keluar terlebih dahulu dengah klik 🚫 pada room sebelumnya!")
        .then(m => m.delete({timeout:5000}));
    }

    return listJoin
}
//function init game
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
function initGames(msg){
    let alreadyJoin = false;

    if(listPlayer.length > 0){
        listPlayer.forEach((list) => {
            if(list === msg.member.id){
                alreadyJoin = true;
            }
        });
    }

    if(alreadyJoin){
        msg.reply("Kamu sudah masuk kedalam room / permainan!").then(r=>r.delete({timeout:3000}))
        return
    }
    
    var listJoin = [];
    listJoin = joinGames(msg, listJoin, msg.member.id);
    
    msg.channel.send({embed: {
        color: 'FF69B4',
        author: {
            name: "Thanks to p.cates who create this bot day and night!",
            icon_url: client.user.avatarURL
        },
        title: "Paya sambung kata (PSK) 💦",
        description: "PSK (Paya sambung kata) aja ya! jangan PSK yang lain !!\nTekan 👍 untuk ikutan, 🚫 untuk keluar room, dan ▶️ untuk memulai game! \n\n Pastikan baca terlebih dahulu panduannya yaa sayang :wink:",
            fields: [{
                name: "Daftar pemain",
                value: "1. <@"+msg.member.id+"> ✅"
            },
            // {
            //     name: "peraturan",
            //     value: "1. Kata yang sudah digunakan tidak dapat digunakan kembali."
            //             +"\n 2. Setiap pemain memiliki 5 nyawa."
            //             +"\n 3. Setiap pemain diberikan kesempatan untuk melakukan re-roll kata masing-masing sebanyak 3x dengan biaya 5 poin."
            //             +"\n 4. Setiap pemain diberikan waktu untuk melanjutkan kata selama 20 detik pada setiap giliran."
            //             +"\n 5. Jika waktu yang diberikan telah habis dan pemain tidak dapat melanjutkan kata, maka soal akan di re-roll untuk dilanjutkan oleh peserta berikutnya. Dan pemain tersebut akan kehilangan 1 nyawa"
            //             +"\n 6. Pemain akan dinyatakan gugur jika sudah tidak memiliki nyawa."
            //             +"\n 7. Jika semua pemain telah gugur atau hanya tersisa 1 pemain. Maka pemenang akan ditentukan berdasarkan kumulatif perolehan koin terbanyak!"
            // },
            ],
            timestamp: new Date(),
            footer: {
                icon_url: client.user.avatarURL,
                text: "© p.cates developer"
            }
        }
    }).then(async resp => {
        
        
        var deleteYet = false
        if(!deleteYet){
            
            resp.react('👍')
            //resp.react('✅')
            resp.react('🚫')
            let userID
            const filter = (reaction, user) => {
                if((reaction.emoji.name === '▶️' || reaction.emoji.name === '👍' || reaction.emoji.name === '🚫' )&& !(user.id===client.user.id)){
                    userID = user.id
                    return true
                }else{
                    return false
                }
            }
            const collector = resp.createReactionCollector(filter, {});
            
            collector.on('collect', async reaction => {
                
            let players =" "
            
                if(reaction.emoji.name === "👍") {
                    players = " "
                    listJoin = joinGames(msg,listJoin,userID)
                    if(listJoin.length>1){
                        resp.react('▶️')
                    }
                    let num = 0
                    listJoin.forEach(item=>{
                        num++
                        let emot = ""
                        if(item.ready)emot = "✅"
                        players += num+". <@"+item.id+"> "+emot+"\n"
                    })
                    
                    resp.edit({embed: {
                        color: 'FF69B4',
                        author: {
                            name: "Thanks to p.cates who create this bot day and night!",
                            icon_url: client.user.avatarURL
                        },
                        title: "Paya sambung kata (PSK) 💦",
                        description: "PSK (Paya sambung kata) aja ya! jangan PSK yang lain !!\nTekan 👍 untuk ikutan, 🚫 untuk keluar room, dan ▶️ untuk memulai game! \n\n Pastikan baca terlebih dahulu panduannya yaa sayang :wink:",
                            fields: [{
                                name: "Daftar pemain",
                                value: players
                            },
                            // {
                            //     name: "peraturan",
                            //     value: "1. Kata yang sudah digunakan tidak dapat digunakan kembali."
                            //             +"\n 2. Setiap pemain memiliki 5 nyawa."
                            //             +"\n 3. Setiap pemain diberikan kesempatan untuk melakukan re-roll kata masing-masing sebanyak 3x dengan biaya 5 poin."
                            //             +"\n 4. Setiap pemain diberikan waktu untuk melanjutkan kata selama 20 detik pada setiap giliran."
                            //             +"\n 5. Jika waktu yang diberikan telah habis dan pemain tidak dapat melanjutkan kata, maka soal akan di re-roll untuk dilanjutkan oleh peserta berikutnya. Dan pemain tersebut akan kehilangan 1 nyawa"
                            //             +"\n 6. Pemain akan dinyatakan gugur jika sudah tidak memiliki nyawa."
                            //             +"\n 7. Jika semua pemain telah gugur atau hanya tersisa 1 pemain. Maka pemenang akan ditentukan berdasarkan kumulatif perolehan koin terbanyak!"
                            // },
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: client.user.avatarURL,
                                text: "© p.cates developer"
                            }
                        }
                    })
                }
                // if(reaction.emoji.name === "✅"){
                //     let userId = userID
                //     let count = 0
                //     let cursor = 0
                //     let ada = false;
                    
                //     listJoin.forEach(item => {
                //         if(item.id === userId) {
                //             cursor = count
                //             ada = true
                //         }
                //         count++
                //     })
                //     if(ada) {
                //         listJoin[cursor].ready = true
                //     }else{
                //         //remove the fuckin react
                //         return
                //     }
                    
                //     let num = 0
                //         listJoin.forEach(item=>{
                //             num++
                //             let emot = ""
                //             if(item.ready)emot = "✅"
                //             players += num+". <@"+item.id+"> "+emot+"\n"
                //         })
    
                //     resp.edit({embed: {
                //         color: 'FF69B4',
                //         author: {
                //             name: "Thanks to p.cates who create this bot day and night!",
                //             icon_url: client.user.avatarURL
                //         },
                //         title: "Paya sambung kata (PSK) 💦",
                //         description: "PSK (Paya sambung kata) aja ya! jangan PSK yang lain !!\nTekan 👍 untuk ikutan, ✅ menandakan sudah siap, dan ▶️ untuk memulai game! \n\n Pastikan baca terlebih dahulu panduannya yaa sayang :wink:",
                //             fields: [{
                //                 name: "Daftar pemain",
                //                 value: players
                //             },
                //             {
                //                 name: "peraturan",
                //                 value: "1. Kata yang sudah digunakan tidak dapat digunakan kembali."
                //                         +"\n 2. Setiap pemain memiliki 5 nyawa."
                //                         +"\n 3. Setiap pemain diberikan kesempatan untuk melakukan re-roll kata masing-masing sebanyak 3x dengan biaya 5 poin."
                //                         +"\n 4. Setiap pemain diberikan waktu untuk melanjutkan kata selama 20 detik pada setiap giliran."
                //                         +"\n 5. Jika waktu yang diberikan telah habis dan pemain tidak dapat melanjutkan kata, maka soal akan di re-roll untuk dilanjutkan oleh peserta berikutnya. Dan pemain tersebut akan kehilangan 1 nyawa"
                //                         +"\n 6. Pemain akan dinyatakan gugur jika sudah tidak memiliki nyawa."
                //                         +"\n 7. Jika semua pemain telah gugur atau hanya tersisa 1 pemain. Maka pemenang akan ditentukan berdasarkan kumulatif perolehan koin terbanyak!"
                //             },
                //             ],
                //             timestamp: new Date(),
                //             footer: {
                //                 icon_url: client.user.avatarURL,
                //                 text: "© p.cates developer"
                //             }
                //         }
                //     })
                // }
                if(reaction.emoji.name === "🚫"){
                    let userId = userID
                    
                    let index = listPlayer.indexOf(userId);
                    if (index !== -1) listPlayer.splice(index, 1)
                    let count = 0
                    listJoin.forEach(item => {
                        if(item.id === userId) index = count
                        count++
                    })
                    if (index !== -1) listJoin.splice(index, 1)
                    let num = 0
                    listJoin.forEach(item=>{
                        num++
                        let emot = ""
                        if(item.ready)emot = "✅"
                        players += num+". <@"+item.id+"> "+emot+"\n"
                    })
    
                    if(listJoin.length == 0 && !deleteYet) {
                        collector.stop()
                        
                    }else{
                        const userReactions = resp.reactions.cache.filter(reaction => reaction.users.cache.has(userId));
                        try {
                            for (const reaction of userReactions.values()) {
                                reaction.users.remove(userId);
                            }
                        } catch (error) {
                            console.error('Failed to remove reactions.');
                        }
                        resp.edit({embed: {
                            color: 'FF69B4',
                            author: {
                                name: "Thanks to p.cates who create this bot day and night!",
                                icon_url: client.user.avatarURL
                            },
                            title: "Paya sambung kata (PSK) 💦",
                            description: "PSK (Paya sambung kata) aja ya! jangan PSK yang lain !!\nTekan 👍 untuk ikutan, 🚫 untuk keluar room dan ▶️ untuk memulai game! \n\n Pastikan baca terlebih dahulu panduannya yaa sayang :wink:",
                                fields: [{
                                    name: "Daftar pemain",
                                    value: players
                                },
                                // {
                                //     name: "peraturan",
                                //     value: "1. Kata yang sudah digunakan tidak dapat digunakan kembali."
                                //             +"\n 2. Setiap pemain memiliki 5 nyawa."
                                //             +"\n 3. Setiap pemain diberikan kesempatan untuk melakukan re-roll kata masing-masing sebanyak 3x dengan biaya 5 poin."
                                //             +"\n 4. Setiap pemain diberikan waktu untuk melanjutkan kata selama 20 detik pada setiap giliran."
                                //             +"\n 5. Jika waktu yang diberikan telah habis dan pemain tidak dapat melanjutkan kata, maka soal akan di re-roll untuk dilanjutkan oleh peserta berikutnya. Dan pemain tersebut akan kehilangan 1 nyawa"
                                //             +"\n 6. Pemain akan dinyatakan gugur jika sudah tidak memiliki nyawa."
                                //             +"\n 7. Jika semua pemain telah gugur atau hanya tersisa 1 pemain. Maka pemenang akan ditentukan berdasarkan kumulatif perolehan koin terbanyak!"
                                // },
                                ],
                                timestamp: new Date(),
                                footer: {
                                    icon_url: client.user.avatarURL,
                                    text: "© p.cates developer"
                                }
                            }
                        })
                    }
                }
                if(reaction.emoji.name === "▶️"){
                    if(listJoin.length > 1){
                        let ready = true
                        listJoin.forEach(item=>{
                            if(!item.ready)ready = false
                        })
                        
                        if(ready){
                            collector.stop()
                            startGames(true,msg,listJoin,0,{})
                        }else{
                            msg.channel.send("Pastikan semua player sudah ready ya!").then(r => r.delete({timeout:5000}));
                        }
                    }
                }
            
            })
            collector.on('end',r=>{
                //resp.reactions.removeAll()
                    resp.delete()
                        // resp.edit({embed: {
                        //     color: '565656',
                        //     author: {
                        //         name: "Thanks to p.cates who create this bot day and night! Bye~",
                        //         icon_url: client.user.avatarURL
                        //     }}})
                        // deleteYet = true
                        return   
            })
        }
    }).catch(error=>console.log(error));
}

function startGames(firstRound,msg,listJoin,position,kata){
    let correct = false
    let pending = false
    let endgame = false
    let time = {time:21000}
    let reroll = false
    var players = ""
    var loser = ""
    let numPlayer = 0
    let numLoser = 0

    listJoin.forEach(item=>{
        if(item.life == 0){
            numLoser++
            loser += `${numLoser}. <@${item.id}> (${item.point})\n`
        }else{
            numPlayer++
            players += `${numPlayer}. <@${item.id}> (${item.point}) 🎲x${item.reRoll} ❤️x${item.life}\n`
        }
    })
    if(numLoser == 0) loser = "-"
    
    if(firstRound){
        let mulaiKata = Math.floor(Math.random() * listJoin.length);
        position = mulaiKata
        time = {}
    }
    if(firstRound){
        msg.channel.send({embed: {
            color: 'FF69B4',
            author: {
                name: "Paya sambung kata 💦"
            },
            title: "Game dimulai!! ",
            description: "Karena ini game pertama, <@"+listJoin[position].id+"> kamu bebas sebutin kata yang kamu mau! (Paling sedikit 4 huruf)",
                fields: [{
                    name: "Daftar pemain aktif",
                    value: players
                }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: client.user.avatarURL,
                    text: "© p.cates developer"
                }
            }
        }).then(resp => {
            var countMsgLength = 0
            const filter = m => {
                if(m.member.id === listJoin[position].id) return true
            };
            const MessCollector = resp.channel.createMessageCollector(filter, time);
            

            MessCollector.on('end', collected => {
                endgame = true
                if(!pending){
                    if(!correct){
                        listJoin[position].life--
                    }
                    resp.delete()
                    startGames(false,msg,listJoin,0,kata)
                }
            });
            MessCollector.on('collect', m => {
                let string = m.content.toString()
                console.log(string)
                countMsgLength = m.content.split("").length 
                console.log(countMsgLength)
                if(countMsgLength>=4){
                    const getKBBI = async (query) => {            
                        pending = true
                        await axios(`https://kateglo.com/api.php?format=json&phrase=${query}`)
                        .then(response => {
                            pending = false
                            if(response.data.kateglo){
                                if(response.data.kateglo.actual_phrase){
                                    m.reply("Maaf kata tidak ditemukan").then(ms=> ms.delete({timeout:2000}))
                                }else{
                                    var lastSuku
                                    let arrPhrase = response.data.kateglo.phrase.split("")
                                    let lastPointer = arrPhrase.length - 1
                                    if(arrPhrase[lastPointer].toLowerCase() === "a" || arrPhrase[lastPointer].toLowerCase() === "i" || arrPhrase[lastPointer].toLowerCase() === "u" || arrPhrase[lastPointer].toLowerCase() === "e" || arrPhrase[lastPointer].toLowerCase() === "o"){
                                        lastPointer--
                                        if(!(arrPhrase[lastPointer].toLowerCase() === "a" || arrPhrase[lastPointer].toLowerCase() === "i" || arrPhrase[lastPointer].toLowerCase() === "u" || arrPhrase[lastPointer].toLowerCase() === "e" || arrPhrase[lastPointer].toLowerCase() === "o")){
                                            lastSuku = arrPhrase[lastPointer]+arrPhrase[lastPointer+1]
                                        }else{
                                            lastSuku = arrPhrase[lastPointer-1]+arrPhrase[lastPointer]+arrPhrase[lastPointer+1]
                                        }
                                    }else{
                                        lastPointer--
                                        if(!(arrPhrase[lastPointer].toLowerCase() === "a" || arrPhrase[lastPointer].toLowerCase() === "i" || arrPhrase[lastPointer].toLowerCase() === "u" || arrPhrase[lastPointer].toLowerCase() === "e" || arrPhrase[lastPointer].toLowerCase() === "o")){
                                            lastSuku = arrPhrase[lastPointer-2]+arrPhrase[lastPointer-1]+arrPhrase[lastPointer]+arrPhrase[lastPointer+1]
                                        }else{
                                            lastPointer--
                                            if(!(arrPhrase[lastPointer].toLowerCase() === "a" || arrPhrase[lastPointer].toLowerCase() === "i" || arrPhrase[lastPointer].toLowerCase() === "u" || arrPhrase[lastPointer].toLowerCase() === "e" || arrPhrase[lastPointer].toLowerCase() === "o")){
                                                lastSuku = arrPhrase[lastPointer]+arrPhrase[lastPointer+1]+arrPhrase[lastPointer+2]
                                            }else{
                                                lastSuku = arrPhrase[lastPointer+1]+arrPhrase[lastPointer+2]
                                            }
                                        }
                                    }
                                    let description = "n/a"
                                    if(response.data.kateglo.definition.length != 0) description = response.data.kateglo.definition[0].def_text
                                    kata = {
                                        kata: response.data.kateglo.phrase,
                                        last_sukuKata: lastSuku,
                                        desc: description,
                                        point: response.data.kateglo.phrase.split("").length
                                    }
                                    dbclient.insert(kata)
                                    if(!endgame){
                                        correct = true
                                        MessCollector.stop()
                                    }else{
    
                                    }
                                }
                                console.log(kata)
                            }else{
                                if(!endgame){
                                    m.reply("Maaf kata tidak ditemukan").then(ms=> ms.delete({timeout:2000}))
                                }else{
                                    MessCollector.stop()
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })  
                    }
                    let found = dbclient.search(m.content)
                    if(!found){
                        getKBBI(m.content)
                    }else{
                        kata = found
                        correct = true
                        MessCollector.stop()
                    }
                }else{
                    msg.reply("Kata harus lebih dari 4 huruf!").then(r=>r.delete({timeout:3000}))
                }
            });
        })
    }else{
        if(numPlayer == 1){
            var winner
            var maxPoint = 0
            listJoin.forEach(pl => {
                if(pl.point >= maxPoint) {
                    maxPoint = pl.point
                    winner = pl.id
                }
                let index = listPlayer.indexOf(pl.id);
                if (index !== -1) listPlayer.splice(index, 1)
            })
            msg.channel.send({embed: {
                color: 'FF69B4',
                author: {
                    name: "Paya sambung kata 💦"
                },
                title: "Game berakhir!",
                description: "Pemenangnya adalah : <@"+winner+">",
                    fields: [
                    {
                        name: "Daftar pemain gugur",
                        value: loser
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "© p.cates developer"
                    }
                }
            })
        }else{
            msg.channel.send({embed: {
                color: 'FF69B4',
                author: {
                    name: "Paya sambung kata 💦"
                },
                title: "Kata sebelumnya **"+kata.kata.toUpperCase()+"**, lanjutkan dengan kata yang berawalan **"+kata.last_sukuKata.toUpperCase()+"**",
                description: kata.desc+"\n*sumber: kateglo.com*",
                    fields: [{
                        name: "Daftar pemain aktif",
                        value: players
                    },
                    {
                        name: "Daftar pemain gugur",
                        value: loser
                    }
                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: "https://i.imgur.com/Kz3cnHQ.gif",
                        text: "Lanjutkan kata sebelum waktu habis! - © p.cates developer"
                    }
                }
            }).then(resp => {
                if(listJoin[position].reRoll > 0) resp.react('🎲')

                const filters = (reaction, user) => {
                    if(reaction.emoji.name === '🎲' && user.id===listJoin[position].id){
                        return true
                    }else{
                        return false
                    }
                }
                const collector = resp.createReactionCollector(filters, {});
                let vocal = ['a','i','u','e','0']
                let abjad = ['b','c','d','j','f','g','h','k','l','m','n','p','r','s','t','v','w','x','y','z']
                collector.on('collect', async reaction => {
                    listJoin[position].reRoll--
                    let p1 = Math.floor(Math.random() * abjad.length);
                    let p2 = Math.floor(Math.random() * vocal.length);
                    let p3 = Math.floor(Math.random() * abjad.length);

                    let akhiran = abjad[p1]+vocal[p2]+abjad[p3]
                    kata = {
                        kata: "telah di re-roll",
                        last_sukuKata: akhiran,
                        desc: "Silahkan cari kata dengan awal seperti diatas!",
                        point: 0
                    }
                    reroll = true
                    MessCollector.stop()
                    collector.stop()
                })
                const filter = m => {
                    if(m.member.id === listJoin[position].id && m.content.startsWith(kata.last_sukuKata)) return true
                };
                const MessCollector = resp.channel.createMessageCollector(filter, time);
    
                MessCollector.on('end', collected => {
                    if(!reroll){
                        endgame = true
                        if(!pending){
                            if(!correct){
                                listJoin[position].life--
                                listJoin[position].point += -5
                            }
                            resp.delete()
                            startGames(false,msg,listJoin,position++,kata)
                        }
                    }else{
                        resp.delete()
                        startGames(false,msg,listJoin,position,kata)
                    }
                });
                MessCollector.on('collect', m => {
                    const getKBBI = async (query) => {            
                        pending = true
                        await axios(`https://kateglo.com/api.php?format=json&phrase=${query}`)
                        .then(response => {
                            pending = false
                            if(response.data.kateglo){
                                if(response.data.kateglo.actual_phrase){
                                    m.reply("Maaf kata tidak ditemukan").then(ms=> ms.delete({timeout:2000}))
                                }else{
                                    var lastSuku
                                    let arrPhrase = response.data.kateglo.phrase.split("")
                                    let lastPointer = arrPhrase.length - 1
                                    if(arrPhrase[lastPointer].toLowerCase() === "a" || arrPhrase[lastPointer].toLowerCase() === "i" || arrPhrase[lastPointer].toLowerCase() === "u" || arrPhrase[lastPointer].toLowerCase() === "e" || arrPhrase[lastPointer].toLowerCase() === "o"){
                                        lastPointer--
                                        if(!(arrPhrase[lastPointer].toLowerCase() === "a" || arrPhrase[lastPointer].toLowerCase() === "i" || arrPhrase[lastPointer].toLowerCase() === "u" || arrPhrase[lastPointer].toLowerCase() === "e" || arrPhrase[lastPointer].toLowerCase() === "o")){
                                            lastSuku = arrPhrase[lastPointer]+arrPhrase[lastPointer+1]
                                        }else{
                                            lastSuku = arrPhrase[lastPointer-1]+arrPhrase[lastPointer]+arrPhrase[lastPointer+1]
                                        }
                                    }else{
                                        lastPointer--
                                        if(!(arrPhrase[lastPointer].toLowerCase() === "a" || arrPhrase[lastPointer].toLowerCase() === "i" || arrPhrase[lastPointer].toLowerCase() === "u" || arrPhrase[lastPointer].toLowerCase() === "e" || arrPhrase[lastPointer].toLowerCase() === "o")){
                                            lastSuku = arrPhrase[lastPointer-2]+arrPhrase[lastPointer-1]+arrPhrase[lastPointer]+arrPhrase[lastPointer+1]
                                        }else{
                                            lastPointer--
                                            if(!(arrPhrase[lastPointer].toLowerCase() === "a" || arrPhrase[lastPointer].toLowerCase() === "i" || arrPhrase[lastPointer].toLowerCase() === "u" || arrPhrase[lastPointer].toLowerCase() === "e" || arrPhrase[lastPointer].toLowerCase() === "o")){
                                                lastSuku = arrPhrase[lastPointer]+arrPhrase[lastPointer+1]+arrPhrase[lastPointer+2]
                                            }else{
                                                lastSuku = arrPhrase[lastPointer+1]+arrPhrase[lastPointer+2]
                                            }
                                        }
                                    }
                                    let description = "n/a"
                                    if(response.data.kateglo.definition.length != 0) description = response.data.kateglo.definition[0].def_text
                                    kata = {
                                        kata: response.data.kateglo.phrase,
                                        last_sukuKata: lastSuku,
                                        desc: description,
                                        point: response.data.kateglo.phrase.split("").length
                                    }
                                    dbclient.insert(kata)
                                    listJoin[position].point += kata.point
                                    if(!endgame){
                                        correct = true
                                        MessCollector.stop()
                                    }else{
                                        startGames(false,msg,listJoin,position++,kata)
                                    }
                                }
                            }else{
                                if(!endgame){
                                    m.reply("Maaf kata tidak ditemukan").then(ms=> ms.delete({timeout:2000}))
                                }else{
                                    listJoin[position].life--
                                    listJoin[position].point += -5
                                    MessCollector.stop()
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error)
                        })  
                    }
                    let found = dbclient.search(m.content)
                    if(!found){
                        getKBBI(m.content)
                    }else{
                        kata = found
                        correct = true
                        MessCollector.stop()
                    }
                });
            })
        }
    }
}
function endGames(msg){
    msg.channel.send("Yahh, udahan ya? Nanti main lagi OK?");
}
function retreatGames(msg){
    msg.reply("aw.. aw.. dah basah ya? ko nyerah!");
    nextGames();
}
function nextGames(msg){
    msg.channel.send("Lanjut?");
}

function logicGame(msg,id){
    let games
    runningGames.forEach((game) => {
        let thisGame = false;
        game.members.forEach((member) => {
            if(member === id){
                thisGame = true
            }
        })
        if(thisGame){
            game.status = 1
            games = game
        }
    })
    
}
//login to discord use the token
client.login("NjkzNzMzNjIwNjAyNjM0MjQx.XoikPQ.Ms-fg0i2gdXuO7rsz0yv5nlUKlM");