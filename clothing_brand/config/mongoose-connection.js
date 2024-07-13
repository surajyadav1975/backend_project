const mongoose= require("mongoose");
const config=require("config");
const dbgr=require("debug")("dev:d");

mongoose.connect(`${config.get("MONGODB_URI")}/Website`)
.then(function(){
    dbgr("connected");
})
.catch(function(err){
    dbgr(err);
})

module.exports = mongoose.connection;