var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var urle = require('url');
var bodyParser = require('body-parser');
var json = require('json');
var logger = require('logger');
var methodOverride= require('method-override');
var nano = require('nano')('http://localhost:5984');


var db = nano.use('address');
var app= express();

app.set('port', process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(express.static(path.join(__dirname,'public')));

app.get('/', routes.index);

app.post('/createdb',function(req,res)
{
    nano.db.create(req.body.dbname,function(err)
    {
        if(err)
        {
            res.send("error creating database "+req.body.dbname);
            return;
        }
        res.send("Database"+req.body.dbname+ "created sucessfully");
    });
});

app.post('/new_contact',function(req,res)
{
    var name= req.body.name;
    var phone = req.body.phone;

    db.insert({name:name,phone:phone,crazy:true},phone,function(err,body,header)
    {
        if(err)
        {
            res.send("ERror creating contact");
            return;
        }
        res.send("Contact created sucessfully");
    });
});


app.post('/view_contact',function(req,res)
{
    var alldoc ="Allowing are the contact";
    db.get(req.body.phone,{revs_info:true},function(err,body)
    {
        if(!err)
        {
            console.log(body);
        }
        if(body)
        {
            alldoc+="Name: "+body.name+"<br/>phone Number: "+body.phone;
        }
        else{
            alldoc="No records found";
        }
        res.send(alldoc);
    });
});

app.post('/delete_contact',function(req,res){
    db.get(req.body.phone,{revs_info:true},function(err,body){
        if(!err)
        {
            db.destroy(req.body.phone,bodu._rev,function(err,body){
                if(err)
                {
                    res.send("error deletinf contact");
                }
            });
            res.send("Contacts deleted succissfully");
        }
    });
});

http.createServer(app).listen(app.get('port'),function(){
    console.log("Express server listeining on port "+app.get('port'));
});
