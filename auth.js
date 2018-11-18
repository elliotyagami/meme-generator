const utils = require("./utils")

    exports.endpoint = function(req, cb){
        let code = req.body.code || ""
        if (!code) cb({"error": "Invalid user"})
        console.log(code)
        utils.authId_retrieve(code, (authId)=>{
            console.log(authId);
            if (!authId) return cb({"error": "Invalid user"}) 
            
            utils.userId_retrieve(authId, (userId)=>{
                if (!userId) cb({"error": "Invalid userid"})
                
                utils.set_authId_to_userId(authId, userId, function(){
                     cb(null, {"authId": authId, "userId": userId})
                });
            })
        })
    }    