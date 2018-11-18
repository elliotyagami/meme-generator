const utils = require("./utils")

                exports.endpoint = function(req, cb){
                    let authid = req.body.authid || "";
                    if (!authid) 
                        cb({"error": "Invalid user"})
                
                    let name = req.body.name || '';
                    if (!name || name === ' ') 
                        cb({"error": "Name empty"})
                        
                    let address = req.body.address || '';
                    if (!address || address === ' ') 
                        cb({"error": "Address empty"})
                        
                    let mobile = req.body.mobile || '';
                    let email = req.body.email || '';
                
                    
                    utils.get_authId_to_userId(authid, function(uid){
                        if (!uid) cb({"error": "Invalid user"})
                        
                        var pb = {address: address, name: name, mobile: mobile, email: email};
                        utils.set_address(uid, pb, function(resp){
                            if (!resp){
                                cb({"error": "internal error"})
                            }
                            cb(undefined, {data: resp})
                        })
                        
                    })
                } 