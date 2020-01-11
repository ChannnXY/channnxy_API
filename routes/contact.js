const express = require('express');
const router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'channnxy'
});
connection.connect();

router.get('/get',function (req,res,next) {
   // console.log(req.query);
   var _res = res;
   var currentPage = parseInt(req.query.currentPage);
   var pageSize = parseInt(req.query.pageSize);
   var startPage = currentPage * pageSize;
   var endPage = startPage + pageSize;
   connection.query('SELECT user.nickName,user.avatarUrl,' +
       'contact.id,contact.content,contact.time,contact.user_id ' +
       'FROM ' +
       'user ,contact ' +
       'WHERE user.id = contact.user_id and contact.is_delete = 0 ' +
       'GROUP BY contact.id ' +
       'ORDER BY ' +
       'contact.time DESC ' +
       'LIMIT ?,?',[startPage,endPage],function (err,res,field) {
       if (err) throw err;
       for(var i in res){
           var time = new Date(res[i].time);
           var year = time.getFullYear();
           var month = time.getMonth()+1;
           var date= time.getDate();
           res[i].time = year + '年' + month + '月' + date + '日';
       }
       var response={
           code:200,
           msg:'OK',
           data:{
               list:res,
               hasNextPage:true}
       };

       connection.query('SELECT count(*) as count FROM contact WHERE is_delete = 0',function (err,res,field) {
           if(res[0].count - (currentPage * pageSize)<5){
               response.data.hasNextPage = false;
           }
           _res.send(response);
       })
   });
});

router.get('/delete',function (req,res,next) {
    var _res = res;
   var id = req.query.id;
   var user_id = req.query.user_id;
    connection.query('UPDATE contact SET is_delete = 1 WHERE id = ? and user_id = ?',[id,user_id],function (err,res,field) {
                // console.log(res);
            if(res.changedRows===1){
                var response={
                    code:200,
                    msg:'OK'
                }
            }else{
                var response={
                    code:0,
                    msg:'删除失败，稍后再试'
                }
        }
        _res.send(response);
    })
});

module.exports = router;

module.exports.input = function (req,res,next) {
    // console.log(req.body);
    var _res = res;
    if(req.body.length!==0){
        connection.query('INSERT INTO contact SET ?',
            {user_id:req.body.user_id,content:req.body.content},
            function (err,res,field) {
                var response = {
                    code:200,
                    msg:'OK',
                    data:res.insertId
                };
                _res.send(response)
            });
    }
};