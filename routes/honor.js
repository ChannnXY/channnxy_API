var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'channnxy'
});
connection.connect();

/* GET home page. */
router.get('/list', function(req, res, next) {
    var _res = res;
    var response = {
        code:200,
        msg:'OK',
        data:[]
    };
    connection.query('SELECT * FROM honor',function (err,res,field) {
        if(err) throw err;
        res = JSON.parse(JSON.stringify(res));
        response.data = res;
        connection.query('SELECT repo_title,repo_id FROM honor_repo WHERE honor_id = 10000',function (err,repo,field) {
            if(err) throw err;
            repo = JSON.parse(JSON.stringify(repo));
            if(res.length>0){
                response.data[0].repo = repo;
            }
            _res.send(response);
        });
    });
});


module.exports = router;
