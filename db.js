var request = require("request");
    var accessKey = "341cc5616d655b6a4ba819fed6f203ca07bd3a589ff8639fcf6448ac23967495";
    var benchId = "memeGenerator";
    var userId = "harshjn";
    
    module.exports={
        "set": function(key, value, callback){
            request.post({ 
                 url:"https://memory.backbench.io/",
                 body: {
                    "cmd": "bb:mem:set",
                    "auth": {
                         "benchId": benchId,
                         "userId": userId,
                         "accessKey": accessKey 
                    },
                    "args": {
                        "key": key,
                        "value": value
                    }
                 },
                 json: true
             }, function (error, response, body) {
                    if (error) {
                        callback(error);
                    } else{
                        callback(undefined, body);
                    }
             });
        }, 
        "get": function(key, cb){
           request.post({
                url: "https://memory.backbench.io/",
                body: {
                    "cmd": "bb:mem:get",
                    "auth": {
                        "benchId": benchId,
                        "userId": userId,
                        "accessKey": accessKey
                      },
                    "args": {
                        "key": key
                    }
                },
                json: true
            }, function (error, response, body) {
                if (error) {
                    cb(error);
                } else{
                    cb(undefined, body.reply);
                }
            }); 
        },
        "delete": function(key, cb){
           request.post({
                url: "https://memory.backbench.io/",
                body: {
                    "cmd": "bb:mem:del",
                    "auth": {
                        "benchId": benchId,
                        "userId": userId,
                        "accessKey": accessKey
                    },
                    "args": {
                        "key": key
                    }
                },
                json: true
            }, function (error, response, body) {
                if (error) {
                    cb(error);
                } else{
                    cb(undefined, body.reply);
                }
            }); 
        }
    };   