const express=require('express')
const app=express();
const mongoose=require('mongoose')
const cors=require('cors');
const http=require('http');

const env=require('dotenv');
env.config();
app.use(cors());
//console.log(`${process.env.USERID}:${process.env.PASSWORD}`);
var conn=mongoose.connect(
    `mongodb+srv://${process.env.USERID}:${process.env.PASSWORD}@cluster0.hdxqe.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.log("Database Connected");
})
app.use(express.json());
app.get('/',(req,res)=>{
    res.status(200).json({
        "msg":"hello"
    });
})
app.post('/addButton',(req,res)=>{
    
    switches.findOne({switchid:req.body.id},(err,prof)=>{
        if(prof){
            
            return res.status(400).json({
                "message":"Already done"
            });
        }
        else{
            
            if(req.body.type=="RGB")
            {
                console.log(req.body.type);
                switches.create({switchid:req.body.id,switchValue:0,switchtype:req.body.type,minValue:0,maxValue:255},(err,prof)=>{
                    if(prof)
                    return res.status(400).json({
                        "message":"Switch Done"
                    });
                });
            }
            else{
                switches.create({switchid:req.body.id,switchValue:0,switchtype:req.body.type},(err,prof)=>{
                    if(prof)
                    return res.status(400).json({
                        "message":"Switch Done"
                    });
                });
            }
        }
    })
});




const https=http.createServer(app);
const { Server } = require("socket.io");
const switches = require('./models/switches');
const io = new Server(https);

io.on('connection',(socket)=>{
    console.log('cLient connected');
    socket.on("on",(msg)=>{
        switches.findOneAndUpdate({switchid:msg},{switchValue:1},{returnOriginal:false},(error,profile)=>{
            if(profile){
                io.emit("on",msg);
            }
        });
        

    })
    socket.on("off",(msg)=>{

        switches.findOneAndUpdate({switchid:msg},{switchValue:0},{returnOriginal:false},(error,profile)=>{
            if(profile){
                io.emit("off",msg);
            }
        });

    })
    socket.on("temp",(msg)=>{

        switches.findOneAndUpdate({switchid:"temp"},{switchValue:msg},{returnOriginal:false},(error,profile)=>{
            if(profile){
                io.emit("temp",msg);
            }
        });;
        
    })
    socket.on("disconnect",(msg)=>{
        console.log(`User disconnected`);
    })
});



https.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`);
});