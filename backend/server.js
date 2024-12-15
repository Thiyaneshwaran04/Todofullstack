const express=require("express")
const app=express()
const mongodb=require("mongodb")
const mongoose=require("mongoose")
const todoroute=require("../backend/routes/todoroutes")
const cors=require("cors")
const bodyParser=require("body-parser")

mongoose.connect(dbURI).then((res)=>{
    console.log("running in 2000");
    console.log("connected to db");
    // app.listen(2000)

})
.catch( (err)=>{
    console.log("error in db ",err);
    
})
app.use(cors({
    origin: "http://localhost:4200", // Allow only your frontend
    methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
    allowedHeaders: "Content-Type,Authorization", // Allowed headers
}));

app.use(express.json())
app.use(bodyParser.json());

app.use('',todoroute)
