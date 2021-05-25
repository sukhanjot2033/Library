

exports.create= function(req,res){
    nano.db.create(req.body.dbname,function(){
        if(err){
            res.send("Error creating a database");
            return;
        }
        res.send("Database created succesfully");
    });
};