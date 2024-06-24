const path=require('path');
const express = require('express');
const fs=require('fs');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

app.get('/', function (req, res) {
    fs.readdir(`./files`,function(err,files){
        res.render("index.ejs",{files: files});
    })
})

app.get('/file/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,data){
        res.render("show.ejs",{Filename:req.params.filename, Filedata: data});
    })
})

app.post('/create', function (req, res) {
    console.log(req.body);
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
        res.redirect('/');
    });
})
app.listen(3000,function(){})