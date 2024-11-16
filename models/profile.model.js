const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema({
    
    contact_number:{
        type:Number
    },
    gender:{
        type:String
    },
    user_profile_image:{
        type:String
    }

},{
    timestamps:true
})

module.exports=mongoose.model("profileModel",profileSchema);