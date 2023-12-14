const mongoose = require("mongoose")

const ChatSchema = new mongoose.Schema({
    members:[{type:mongoose.Types.ObjectId,ref:"user",default:[]}],
},{
    timestamps:true,
} )

const Chatmodel = mongoose.model("chat",ChatSchema)

module.exports ={Chatmodel}