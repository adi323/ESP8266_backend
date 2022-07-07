const mongoose=require('mongoose');
const Switches=mongoose.Schema({
    switchid:{
        type:String,
        required:true,
    },
    switchValue:{
        type:Number,
        default:0,
        required:true,
    },
    switchtype:{
        type:String,
        default:"Switch",
        required:true,
        enum:["Switch","Data","RGB"]
    },
    minValue:{
        required:false,
        type:Number,
        default:0,
    },
    maxValue:{
        required:false,
        type:Number,
        default:255,
    }
},{timestamps:true});

module.exports=mongoose.model("Data",Switches);