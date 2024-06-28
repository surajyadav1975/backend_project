const express=require("express");
const upload=require("../config/multer-config");
const productModel=require("../models/product-model");
const router= express.Router();

router.post("/create",upload.single("image"),async function(req,res){
    try{
        let {name, price, discount, bgcolor, panelcolor, textcolor,}=req.body;

        let createprod=await productModel.create({
            image:req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        });
        req.flash("success","product created successfully");
        return res.redirect("/owners/admin");
    }catch(err){
         return res.redirect(err.message);
    }
});

module.exports=router;
