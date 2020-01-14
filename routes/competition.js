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

router.get('/list',function (req,res,next) {
    var _res = res;
    var response = {
        code:200,
        msg:'OK',
        data:{}
    };
    connection.query('SELECT * FROM competition',function (err,res,field) {
        if(err) throw err;
        console.log(JSON.parse(JSON.stringify(res)));
        response.data = JSON.parse(JSON.stringify(res));
        _res.send(response);
    });
});

router.get('/getItem',function (req,res,next) {
    var _res = res;
    var response = {
        code:200,
        msg:'OK',
        data:{}
    };
    connection.query('SELECT * FROM competition where id = ?',[req.query.id],function (err,res,field) {
                if(err) throw err;
                // console.log(JSON.parse(JSON.stringify(res)));
                response.data = JSON.parse(JSON.stringify(res[0]));
                connection.query('SELECT img_url FROM com_image where competition_id = ?',[req.query.id],function (err,res,field) {
                    if(err) throw err;
                    // console.log(JSON.parse(JSON.stringify(res)));
                    response.data.img = JSON.parse(JSON.stringify(res));
            _res.send(response);
        });
    });
});


module.exports = router;