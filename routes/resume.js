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

router.get('/get',function (req,res,next) {
    var _res = res;
    var response = {
        code:200,
        msg:'OK',
        data:{}
    };
   connection.query('SELECT content FROM user_info',function (err,res,field) {
       if(err) throw err;
       // console.log(JSON.parse(JSON.stringify(res)));
       response.data.info = JSON.parse(JSON.stringify(res));
   });
    connection.query('SELECT content FROM user_skills',function (err,res,field) {
        if(err) throw err;
        // console.log(JSON.parse(JSON.stringify(res)));
        response.data.skills = JSON.parse(JSON.stringify(res));
    });
    connection.query('SELECT time,content FROM user_competition',function (err,res,field) {
        if(err) throw err;
        // console.log(JSON.parse(JSON.stringify(res)));
        response.data.competition = JSON.parse(JSON.stringify(res));
    });
    connection.query('SELECT user_project.time,user_project.work,user_project.roles,user_project_content.content ' +
        'FROM user_project,user_project_content',function (err,res,field) {
        if(err) throw err;
        // console.log(res);
        // console.log(JSON.parse(JSON.stringify(res)));
        response.data.project = JSON.parse(JSON.stringify(res));
    });
    connection.query('SELECT user_experience.time,user_experience.work,user_experience.roles,user_experience_content.content ' +
        'FROM user_experience,user_experience_content',function (err,res,field) {
        if(err) throw err;
        // console.log(JSON.parse(JSON.stringify(res)));
        response.data.experience = JSON.parse(JSON.stringify(res));
        _res.send(response);
    });
});

module.exports = router;