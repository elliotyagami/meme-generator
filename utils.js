  const request = require("request");
    const db = require("./db");
    
    module.exports = {
    "get_authId_to_userId": function(authid, callback){ //outputs id or null
            db.get("authids", function(err, auths){
                if (!auths){
                    auths = {}
                }
                
                if(auths[authid]){
                    callback(auths[authid])
                } else{
                    callback("")
                }
            })
        },
        "set_authId_to_userId": function(authid, id, callback){ //outputs id or null
            db.get("authids", function(err, authids){
                
                if (!authids){
                    authids = {}
                }
                authids[authid] = id;
                db.set("authids", authids, function(){
                    callback({"status": "done"})
                })
            })
        },
        "authId_retrieve": function(code, callback){
            console.log(process.env)
            let jsons =  {
                    'client_id': process.env.CID,
                    'client_secret': process.env.CSEC,
                    'code': code
                }
            console.log(jsons)
            console.log(process.env.CID)
            console.log(code)
            request({
                method: "POST",
                url:'https://github.com/login/oauth/access_token', 
                json: jsons,
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            }, function(err,httpResponse,body){
                if (err){
                    console.log(err)
                    callback("")
                }
                console.log(body)
                callback(body.access_token)
            })
            //callback("auth_id")
        },
        "userId_retrieve": function(at, callback){
            request({
                url: "https://api.github.com/user?access_token="+at,
                method: "GET",
                headers: {
                    "User-agent": "api"
                }
            }, function(err,httpResponse,body){
                if (err){
                    console.log(err)
                    callback("")
                }
                callback(JSON.parse(body).login)
            })
            //callback("user_id")
        },
        "get_address": function(uid, callback){
            db.get("addresses", (err, addresses)=>{
                if (!addresses) addresses = {}
                    
                if(addresses[uid]){
                    callback(addresses[uid])
                } else{
                    callback("")
                }
            })
        },
        "set_address": function(uid, data, callback){
            db.get("addresses", function(err, addresses){
                if (!addresses){
                    addresses = {}
                }
                if(!addresses[uid]){
                    addresses[uid] = []
                }
                addresses[uid].push(data)
                db.set("addresses", addresses, function(err, res){
                    console.log(err, res)
                    callback(addresses)
                })
                
            })
        }
    } //all one level arguments                    