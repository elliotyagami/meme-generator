   const utils = require("./utils")

        //api - view layer
        exports.endpoint = function(req, cb){
            let authid = req.body.authid || "";
            if (!authid) return cb({"error": "Invalid user"})
            utils.get_authId_to_userId(authid, function(uid){
                console.log(authid)
                console.log(uid)
                
                if (!uid) cb({"error": "Invalid user"})
                utils.get_address(uid, function(data){ //api level response
                    if(!data) cb(undefined, [])			
                    else cb(null, data)
                })
            })
        }   