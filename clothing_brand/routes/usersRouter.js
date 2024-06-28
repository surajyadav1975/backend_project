const express=require("express");
const router= express.Router();
const isloggedin=require("../middlewares/isloggedin")
const {registeruser,loginuser,logoutuser}=require("../controllers/authcontroller");

router.get("/",function(req,res){
    res.send("hey its working");
});

router.post("/register",registeruser);
router.post("/login",loginuser);
router.get("/logout",logoutuser);
module.exports=router;
