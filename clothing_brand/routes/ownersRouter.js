const express=require("express");
const router= express.Router();
const ownerModel=require("../models/owner-model");

router.get("/",function(req,res){
    res.send("hey its working");
});

if(process.env.NODE_ENV==="dev"){
    router.post("/create",async function(req,res){
        let owners=await ownerModel.find();
        if(owners.length > 0){
            return res.status(500).send("you dont have permission to be owner");
        }
        let {fullname ,email,password}=req.body;
        let createdowner= await ownerModel.create({
            fullname,
            email,
            password,
        })
        res.status(200).send(createdowner);
    })
}

router.get("/admin",function(req,res){
    let success=req.flash("success");
    res.render("createproducts",{success});
});

module.exports=router;
