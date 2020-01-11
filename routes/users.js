const express = require('express');
const router = express.Router();
const request = require('request');
const oauth = require('wechat-oauth');

var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'channnxy'
});
connection.connect();

/* GET users listing. */
router.get('/login', function(req, res, next) {
    var _res = res;
    // console.log(req.query.code);
    //获取openid和sessionkey
    var url = 'https://api.weixin.qq.com/sns/jscode2session?grant_type=client_credential&appid=wx946e1918a27116a5&secret=0b72f67d7516d5070c287b3520e95cef&js_code=' + req.query.code;
    request(url,null,function (err, res, body) {
        var data = JSON.parse(body);
        var session_key = body.session_key;
        var openid = data.openid;
        //查询是否有这个用户
        connection.query("SELECT id FROM user WHERE openid = '"+openid+"'",function (err,res,field) {
           if(res.length===0){
               //如果没有查询到结果，就是没有这个用户，注册
               //首先要获取用户头像和昵称,调用接口需要用到accessToken
               request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx946e1918a27116a5&secret=0b72f67d7516d5070c287b3520e95cef',null,function (req,res,body) {
                   var token  = JSON.parse(body).access_token;
                   request('https://api.weixin.qq.com/cgi-bin/user/info?lang=zh_CN&access_token='+token+'&openid='+openid,null,function (req,res,body) {
                       console.log(JSON.parse(body));
                   })
               });
               // connection.query("INSERT INTO user SET  ?"
               //     ,{
               //         session_key:session_key,
               //         openid:openid
               //     },function (res) {
               //
               // })
           }
        })

    });
    _res.send('login');
});

module.exports = router;
