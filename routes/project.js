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


router.get('/getList', function(req, res, next) {
    var _res = res;
    connection.query('SELECT * FROM project',function (err,res,field) {
        var response={
            msg:'OK',
            code:200,
            data:res
        };
        _res.send(response);
    });
});

router.get('/getItemIntro',function (req,res,next) {
    var _res = res;
    var response = {
        code:200,
        msg:"OK",
        data:{
            roles:[],
            result:[],
            intro:[]
        }
    };
    connection.query('SELECT project_intro.intro FROM ' +
        'project LEFT JOIN project_intro ON project.id = project_intro.project_id ' +
        'WHERE id = ?',[req.query.id],function (err,res,field) {
        if(err) throw err;
        for(var i in res){
            response.data.intro.push(res[i].intro);
        }
    });
    connection.query('SELECT b.result FROM ' +
        'project a LEFT JOIN project_result b ON a.id = b.project_id ' +
        'WHERE id = ?',[req.query.id],function (err,res,field) {
        if(err) throw err;
        for(var i in res){
            response.data.result.push(res[i].result);
        }
    });
    connection.query('SELECT b.roles FROM ' +
        'project a LEFT JOIN project_roles b ON a.id = b.project_id ' +
        'WHERE id = ?',[req.query.id],function (err,res,field) {
        for(var i in res){
            response.data.roles.push(res[i].roles);
        }
        _res.send(response);
    });
});

router.get('/getProblem',function (req,res,next) {
    var _res = res;
    var response = {
        code: 200,
        msg: "OK",
        data: []
    };
    connection.query('SELECT intro FROM project_problems WHERE project_id = ?',[req.query.req],function (err,res,field) {
        for(var i in res){
            response.data.push(res[i].intro)
        }
        _res.send(response);
    });
});

router.get('/getImage',function (req,res,next) {
    var _res = res;
    var response = {
        code: 200,
        msg: "OK",
        data: []
    };
    connection.query('SELECT img FROM project_img WHERE project_id = ?',[req.query.id],function (err,res,field) {
        if(err) throw err;
        console.log(res);
        for(var i in res){
            response.data.push(res[i].img)
        }
        _res.send(response);
    });
});

module.exports = router;
