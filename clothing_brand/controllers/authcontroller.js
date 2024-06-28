const userModel=require("../models/user-model");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {generatetoken}=require("../utils/generatetoken")

module.exports.registeruser=async function(req,res){

    try{
     let{email,fullname,password}=req.body;
     let user=await userModel.findOne({email});
     if(user){
         req.flash("error","you have been already registerd, try login");
         return res.redirect("/");
     }
     bcrypt.genSalt(10,function(err,salt){
         bcrypt.hash(password,salt,async function(err,hash){
             if(err) return req.send(err.message);
             else{
                 let user= await userModel.create({
                     fullname,
                     email,
                     password:hash,
                 })
    
                 let token=generatetoken(user);
                 res.cookie("token",token);
                 res.redirect("/shop");
             }
         })
     })
    }catch(err){
     res.send(err.message);
    }
 };

 module.exports.loginuser=async function(req,res){
    let{email,password}=req.body;

    let user=await userModel.findOne({email});
    if(!user){
        req.flash("error","email or password is incorrect");
         return res.redirect("/");
    }
    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            let token=generatetoken(user);
            res.cookie("token",token);
            res.redirect("/shop");
        }
        else{
            req.flash("error","email or password is incorrect");
             return res.redirect("/");
        }
    });
 };

 module.exports.logoutuser=async function(req,res){
     res.cookie("token","");
     return res.redirect("/");
 };