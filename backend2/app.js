const express=require('express');
const app=express();
const path=require('path');
const cookieparser=require('cookie-parser');
const userModel=require('./models/users');
const postModel=require('./models/posts');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const multer  = require('multer');
const crypto=require('crypto');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieparser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/upload');
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12,function(err,bytes){
            const fn=bytes.toString("hex")+path.extname(file.originalname);
            cb(null, fn);
        })
    }
  })
  
  const upload = multer({ storage: storage })

app.get('/test',(req,res)=>{
    res.render("imageup.ejs");
})

app.post('/upload',upload.single("image"),(req,res)=>{
    console.log(req.file);
})

app.get('/',(req,res)=>{
    res.render("index.ejs");
})

app.get('/login',(req,res)=>{
    res.render("login.ejs");
})
app.get('/profile',isloggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email});
    res.render("profile.ejs",{user});
})

app.post('/login',async (req,res)=>{
    let {email,password}=req.body;
    let user=await userModel.findOne({email});

    if(!user) return res.status(500).send("Something went Wrong");

    bcrypt.compare(password,user.password,async (err,result)=>{
        let token=jwt.sign({email:email,userid:user._id},"shhhhhhhh");
        res.cookie("token",token);
        if(result) res.redirect("/profile");
        else res.redirect("/login");
    })
})

app.post('/register',async(req,res)=>{
    let {username,name,email,age,password}=req.body;
    let user=await userModel.findOne({email});
    if(user) return res.status(500).send("user already registered");
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            let user=await userModel.create({
                username,
                name,
                email,
                age,
                password : hash,
            })
            let token=jwt.sign({email:email,userid:user._id},"shhhhhhhh");
            res.cookie("token",token);
            res.send(user);
        })
    })
})

app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect("/login");
})

function isloggedin(req,res,next){
    if(req.cookies.token===""){ 
        res.redirect("/login");
    }
    else{
        let data=jwt.verify(req.cookies.token,"shhhhhhhh")
        req.user=data;
    }
    next();
}

app.listen(3000);