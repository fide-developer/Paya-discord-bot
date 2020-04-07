const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "/discordbot.db";
var db

class DatabaseKata{
    constructor(){}
    connect(){
        db = new sqlite3.Database(dbFile,sqlite3.OPEN_READWRITE, (err)=>{
            if(err) throw err
            
            db.serialize(function(){
                let sql = `CREATE TABLE IF NOT EXISTS kbbi(
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    kata VARCHAR(255),
                    last_sukuKata VARCHAR(25),
                    desc VARCHAR(255),
                    point INTEGER
                );`;
                db.run(sql, (err) => {
                    if(err) throw err;
                    console.log("Table created");
                });
            
            });
        })
    }
    insert(value){
        this.connect()
        db.serialize(function(){

            let sql = "INSERT INTO kbbi (kata, last_sukuKata,desc,point) VALUES ('"+value.kata+"', '"+value.last_sukuKata+"', '"+value.desc+"', '"+value.point+"')";
            db.run(sql, (err) => {
                if(err) throw err;
                console.log("1 record inserted");
            });
        
        });
        this.disconnect()
    }
    search(query,callback){
        let rVal = "fucek"
        this.connect()
        db.serialize(function(){
            let sql = `SELECT * FROM kbbi WHERE kata=?`;
        
            db.get(sql, query, (err, row) => {
                if (err) throw err;
                let kata
                if(row){
                    // cetak isi row
                    var val = {
                        kata: row.kata,
                        last_sukuKata: row.last_sukuKata,
                        desc: row.desc,
                        point: row.point
                    }
                    kata = val
                    rVal = "fucek hands up"
                    //return val
                } else {
                    kata = null
                    //return null
                }
                callback(kata)
            });
        
        });
        this.disconnect()
        return rVal
    }
    disconnect(){
        db.close()
    }
}

module.exports.DatabaseKata = DatabaseKata