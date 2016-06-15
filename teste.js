var express   =    require("express");
 var mysql     =    require('mysql');
 var app       =    express();
 
 var pool      =    mysql.createPool({
     connectionLimit : 100, //important
     host     : 'localhost',
     user     : 'root',
     password : '852456963',
     database : 'DadosArduino',
     debug    :  false
 });
 
 function handle_database(req,res) {
     
     pool.getConnection(function(err,connection){
         if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
         }   
 
         console.log('connected as id ' + connection.threadId);
         
         connection.query("insert into dados (watt, horario) values (1000, '9999-12-31 23:59:59');",function(err,result){
	     console.log('The solution is: ', result);
             connection.release();
             if(!err) {
                 res.json(result);
             }           
         });
 
         connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
         });
   });
 }
 
 app.get("/",function(req,res){-
         handle_database(req,res);
 });
 
 app.listen(3000);
