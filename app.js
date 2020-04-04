//require discord.js
const Discord = require("discord.js");

//create a new client using the  new keyword.
const client = new Discord.Client();

//const for setup the game
const initiategame = "psk init";
const joingame = "psk join";
const startgame = "psk start";
const endgame = "psk end";
const retreat = "psk ampun";
const maxJoinGame = 6;

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
function joinGames(id,listJoin) {
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
            ready:false
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
    //listJoin = joinGames(msg, listJoin);
    initUser = msg.member.id
    msg.channel.send({embed: {
        color: 'FF69B4',
        author: {
            name: "Thanks to p.cates who create this bot day and night!",
            icon_url: client.user.avatarURL
        },
        title: "Paya sambung kata (PSK) 💦",
        description: "PSK (Paya sambung kata) aja ya! jangan PSK yang lain !!\nTekan 👍 untuk ikutan, ✅ menandakan sudah siap, dan ▶️ untuk memulai game! \n\n Pastikan baca terlebih dahulu panduannya yaa sayang :wink:",
            fields: [{
                name: "Daftar pemain",
                value: "1. "
            },
            {
                name: "peraturan",
                value: "1. Kata yang sudah digunakan tidak dapat digunakan kembali."
                        +"\n 2. Setiap pemain memiliki 5 nyawa."
                        +"\n 3. Setiap pemain diberikan kesempatan untuk melakukan re-roll kata masing-masing sebanyak 3x dengan biaya 5 poin."
                        +"\n 4. Setiap pemain diberikan waktu untuk melanjutkan kata selama 20 detik pada setiap giliran."
                        +"\n 5. Jika waktu yang diberikan telah habis dan pemain tidak dapat melanjutkan kata, maka soal akan di re-roll untuk dilanjutkan oleh peserta berikutnya. Dan pemain tersebut akan kehilangan 1 nyawa"
                        +"\n 6. Pemain akan dinyatakan gugur jika sudah tidak memiliki nyawa."
                        +"\n 7. Jika semua pemain telah gugur atau hanya tersisa 1 pemain. Maka pemenang akan ditentukan berdasarkan kumulatif perolehan koin terbanyak!"
            },
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
            resp.react('✅')
            resp.react('🚫')
            let userID
            const filter = (reaction, user) => {
                if((reaction.emoji.name === '👍' || reaction.emoji.name === '✅' || reaction.emoji.name === '🚫' )&& !(user.id===client.user.id)){
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
                    listJoin = joinGames(userID,listJoin)
                    
                    let num = 0
                    listJoin.forEach(item=>{
                        num++
                        let emot = ""
                        if(item.status)emot = "✅"
                        players += num+". <@"+item.id+"> "+emot+"\n"
                    })
                    
                    resp.edit({embed: {
                        color: 'FF69B4',
                        author: {
                            name: "Thanks to p.cates who create this bot day and night!",
                            icon_url: client.user.avatarURL
                        },
                        title: "Paya sambung kata (PSK) 💦",
                        description: "PSK (Paya sambung kata) aja ya! jangan PSK yang lain !!\nTekan 👍 untuk ikutan, ✅ menandakan sudah siap, dan ▶️ untuk memulai game! \n\n Pastikan baca terlebih dahulu panduannya yaa sayang :wink:",
                            fields: [{
                                name: "Daftar pemain",
                                value: players
                            },
                            {
                                name: "peraturan",
                                value: "1. Kata yang sudah digunakan tidak dapat digunakan kembali."
                                        +"\n 2. Setiap pemain memiliki 5 nyawa."
                                        +"\n 3. Setiap pemain diberikan kesempatan untuk melakukan re-roll kata masing-masing sebanyak 3x dengan biaya 5 poin."
                                        +"\n 4. Setiap pemain diberikan waktu untuk melanjutkan kata selama 20 detik pada setiap giliran."
                                        +"\n 5. Jika waktu yang diberikan telah habis dan pemain tidak dapat melanjutkan kata, maka soal akan di re-roll untuk dilanjutkan oleh peserta berikutnya. Dan pemain tersebut akan kehilangan 1 nyawa"
                                        +"\n 6. Pemain akan dinyatakan gugur jika sudah tidak memiliki nyawa."
                                        +"\n 7. Jika semua pemain telah gugur atau hanya tersisa 1 pemain. Maka pemenang akan ditentukan berdasarkan kumulatif perolehan koin terbanyak!"
                            },
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: client.user.avatarURL,
                                text: "© p.cates developer"
                            }
                        }
                    })
                }
                if(reaction.emoji.name === "✅"){
                    let userId = userID
                    let count = 0
                    let cursor = 0
                    let ada = false;
                    
                    listJoin.forEach(item => {
                        if(item.id === userId) {
                            cursor = count
                            ada = true
                        }
                        count++
                    })
                    if(ada) {
                        listJoin[cursor].ready = !listJoin[cursor].ready
                    }else{
                        //remove the fuckin react
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
                        description: "PSK (Paya sambung kata) aja ya! jangan PSK yang lain !!\nTekan 👍 untuk ikutan, ✅ menandakan sudah siap, dan ▶️ untuk memulai game! \n\n Pastikan baca terlebih dahulu panduannya yaa sayang :wink:",
                            fields: [{
                                name: "Daftar pemain",
                                value: players
                            },
                            {
                                name: "peraturan",
                                value: "1. Kata yang sudah digunakan tidak dapat digunakan kembali."
                                        +"\n 2. Setiap pemain memiliki 5 nyawa."
                                        +"\n 3. Setiap pemain diberikan kesempatan untuk melakukan re-roll kata masing-masing sebanyak 3x dengan biaya 5 poin."
                                        +"\n 4. Setiap pemain diberikan waktu untuk melanjutkan kata selama 20 detik pada setiap giliran."
                                        +"\n 5. Jika waktu yang diberikan telah habis dan pemain tidak dapat melanjutkan kata, maka soal akan di re-roll untuk dilanjutkan oleh peserta berikutnya. Dan pemain tersebut akan kehilangan 1 nyawa"
                                        +"\n 6. Pemain akan dinyatakan gugur jika sudah tidak memiliki nyawa."
                                        +"\n 7. Jika semua pemain telah gugur atau hanya tersisa 1 pemain. Maka pemenang akan ditentukan berdasarkan kumulatif perolehan koin terbanyak!"
                            },
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: client.user.avatarURL,
                                text: "© p.cates developer"
                            }
                        }
                    })
                }
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
                            description: "PSK (Paya sambung kata) aja ya! jangan PSK yang lain !!\nTekan 👍 untuk ikutan, ✅ menandakan sudah siap, dan ▶️ untuk memulai game! \n\n Pastikan baca terlebih dahulu panduannya yaa sayang :wink:",
                                fields: [{
                                    name: "Daftar pemain",
                                    value: players
                                },
                                {
                                    name: "peraturan",
                                    value: "1. Kata yang sudah digunakan tidak dapat digunakan kembali."
                                            +"\n 2. Setiap pemain memiliki 5 nyawa."
                                            +"\n 3. Setiap pemain diberikan kesempatan untuk melakukan re-roll kata masing-masing sebanyak 3x dengan biaya 5 poin."
                                            +"\n 4. Setiap pemain diberikan waktu untuk melanjutkan kata selama 20 detik pada setiap giliran."
                                            +"\n 5. Jika waktu yang diberikan telah habis dan pemain tidak dapat melanjutkan kata, maka soal akan di re-roll untuk dilanjutkan oleh peserta berikutnya. Dan pemain tersebut akan kehilangan 1 nyawa"
                                            +"\n 6. Pemain akan dinyatakan gugur jika sudah tidak memiliki nyawa."
                                            +"\n 7. Jika semua pemain telah gugur atau hanya tersisa 1 pemain. Maka pemenang akan ditentukan berdasarkan kumulatif perolehan koin terbanyak!"
                                },
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

function startGames(msg){
    var message = msg
    if(initStatus == 1){
        if(listJoin.length <= maxJoinGame){
            runningGames.push({
                id : initUser,
                status : 0,
                members : listJoin,
            })
            let start = setTimeout(function asd (){
                message.channel.send("@everyone sudah dimulai");
                logicGame(message,message.member.id)
            },10000)
            msg.channel.send("Permainan Dimulai dalam 5 detik!!");
        }else{
            let hasilBagi = listJoin.length % maxJoinGame
            if(hasilBagi == 0){
                let newList = shuffle(listJoin)
                let numbers = 0;
                let initialUser
                let mentionUser
                let listPlayer = []
                for(i=0;i<newList.length;i++){
                    numbers++
                    if(numbers == 1){
                        listPlayer = []
                        listPlayer.push(newList[i])
                        initialUser = newList[i].id
                        mentionUser = "Hallo <@"+newList[i].id+">"
                    }else{
                        if(numbers<=maxJoinGame){
                            listPlayer.push(newList[i])
                            mentionUser += ", <@"+newList[i].id+">"
                        }else{
                            numbers = 0
                            runningGames.push({
                                id : initialUser,
                                status : 0,
                                members : listPlayer,
                            })
                            let start = setTimeout(function asd (){
                                message.channel.send("@everyone sudah dimulai");
                                logicGame(message,message.member.id)
                            },10000)
                            msg.channel.send("Hiii, "+mentionUser+" !!Permainan akan dimulai dalam 10 detik!!");
                        }
                    }
                }
            }else{
                let a = listJoin.length;
                let count = 0;
                while(a>0){
                    a = a-maxJoinGame
                    count++
                }
                let calcTeam = listJoin.length/count
                let playerTeam = calcTeam.toString().split(".")[0]
                let newList = shuffle(listJoin)
                let numbers = 0
                let availPlayer = listJoin.length
                let position = 0
                for(i=0;i<count;i++){
                    availPlayer--
                    numbers++
                    if(numbers == 1){
                        position++
                        if(position == count){
                            playerTeam = availPlayer
                        }
                        listPlayer = []
                        listPlayer.push(newList[i])
                        initialUser = newList[i].id
                        mentionUser = "Hallo <@"+newList[i].id+">"
                    }else{
                        if(numbers<=playerTeam){
                            listPlayer.push(newList[i])
                            mentionUser += ", <@"+newList[i].id+">"
                        }else{
                            numbers = 0
                            runningGames.push({
                                id : initialUser,
                                status : 0,
                                members : listPlayer,
                            })
                            let start = setTimeout(function asd (){
                                message.channel.send("@everyone sudah dimulai");
                                logicGame(message,message.member.id)
                            },10000)
                            msg.channel.send("Hiii, "+mentionUser+" !!Permainan akan dimulai dalam 10 detik!!");
                        }
                    }
                }
            }
        }
    }else{
        msg.reply("Permainan minimal dimulai dengan 2 orang yaa sayang.. Ayo undang temanmu lagiiii :wink:")
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
client.login("NjkzNzMzNjIwNjAyNjM0MjQx.XoiQ1Q.7Mku6lC05QlnbBzu8atoW3sA1-0");
