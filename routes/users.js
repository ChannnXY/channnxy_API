const express = require('express');
const router = express.Router();
const request = require('request');
const OAuth = require('wechat-oauth');
const oauth = new OAuth('wx946e1918a27116a5','0b72f67d7516d5070c287b3520e95cef');

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
    //获取openid和session_key
    var url = 'https://api.weixin.qq.com/sns/jscode2session?grant_type=client_credential&appid=wx946e1918a27116a5&secret=0b72f67d7516d5070c287b3520e95cef&js_code=' + req.query.code;
    request(url,null,function (err, res, body) {
        var data = JSON.parse(body);
        var session_key = data.session_key;
        var openid = data.openid;
        //查询是否有这个用户
        connection.query("SELECT id FROM user WHERE openid = '"+openid+"'",function (err,res,field) {
           if(res.length===0){
               //如果没有查询到结果，返回错误
               var resData={
                   status:0,
                   msg:'CAN NOT FIND USERD OPENID',
                   data:data
               };
               _res.send(resData);
           }else{
               //用户登录获取用户id,并更新session_key
               connection.query("SELECT id,avatarUrl,nickName FROM user WHERE openid = ?"
                   ,[openid],function (err,res,field) {
                   if(err) throw err;
                   var data = res[0];
                   connection.query('UPDATE user SET session_key = ? WHERE openid = ?',[session_key,openid],function (err,res,field) {
                           if(err) throw err;
                           if(res.changedRows===1){
                               var resData={
                                   status:200,
                                   msg:'OK',
                                   data:data
                               };
                           }else{
                               var resData={
                                   status:0,
                                   msg:'LOGIN SUCCESS BUT FAILED TO UPDATE SESSION_KEY',
                                   data:data
                               };
                           }
                            _res.send(resData);
                       });
                })
           }
        })
    });
});

router.get('/register',function (req,res,next) {
    //获取openid和session_key
    var _res= res;
    var url = 'https://api.weixin.qq.com/sns/jscode2session?grant_type=client_credential&appid=wx946e1918a27116a5&secret=0b72f67d7516d5070c287b3520e95cef&js_code=' + req.query.code;
    request(url,null,function (err, res, body) {
        var data = JSON.parse(body);
        var session_key = data.session_key;
        var openid = data.openid;
        connection.query("SELECT id,avatarUrl,avatarUrl FROM user WHERE openid = ?",[openid],function (err,res,field) {
           if(res.length>0){
               var resData={
                   status:200,
                   msg:'OK',
                   data:res[0]
               };
               _res.send(resData);
           } else{
               connection.query("INSERT INTO user SET  ?"
                   ,{  session_key:session_key,
                       openid:openid,
                       nickName:req.query.nickName,
                       avatarUrl:req.query.avatarUrl,
                       city:req.query.city,
                       country:req.query.country,
                       province:req.query.province },function (err,res,field) {
                       var resData={
                           status:200,
                           msg:'OK',
                           data:{id:res.insertId,
                               avatarUrl:req.query.avatarUrl,
                               nickName:req.query.nickName}
                       };
                       _res.send(resData);
                   })
           }
        });

    })
});

module.exports = router;
