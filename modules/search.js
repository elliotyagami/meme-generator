const utils = require("./utils");

    exports.endpoint = function(req, cb){
        let authid = req.body.authid;
        let keyword = req.body.keyword;
        
        if (!authid) {
            return cb({"error": "Invalid user"})
        }
        if (!keyword) {
            return cb({"error": "Invalid user"})
        }
        
        utils.get_authId_to_userId(authid, function(uid){
            if(!uid){
                return cb({"error": "Invalid user"})
            }
            utils.get_address(uid, function(addresses){ //api level response
                if(!addresses) {
                    addresses = []
                }			
                const result = addresses.filter( address => address.name.includes(keyword));
                if (!result){
                    return cb({"error": "no results found"})
                } else{
                    return cb(undefined, {data: result})
                }
            })
        })
    }