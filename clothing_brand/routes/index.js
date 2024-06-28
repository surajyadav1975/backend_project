const express=require("express");
const router=express.Router();
const productModel=require("../models/product-model")
const isloggedin=require("../middlewares/isloggedin");
const userModel = require("../models/user-model");

router.get("/",function(req,res){
    let error=req.flash("error");
    res.render("index",{error,loggedin:false});
});

router.get("/shop",isloggedin,async function (req,res){
    let products=await productModel.find();
    let success=req.flash("success");
    res.render("shop",{products,success});
})
router.get("/cart",isloggedin,async function (req,res){
    let user=await userModel.findOne({email:req.user.email}).populate("cart");
    res.render("cart",{user});
})
router.get("/addtocart/:id",isloggedin,async function (req,res){
    try{
        let user=await userModel.findOne({email:req.user.email});
        user.cart.push(req.params.id);
        await user.save();
        req.flash("success","Added to cart");
        res.redirect("/shop");
    }catch(err){
        res.status(500).send('An error occurred');
    }
})



module.exports=router;