const db = require("./db");

                exports.endpoint = (req, cb)=>{
                    db.set("authids", {}, function(){
                        db.set("addresses", {}, function(){
                            cb({"status": "success"})
                        })
                    })   
                }
            