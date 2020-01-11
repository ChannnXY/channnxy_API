var appid = 'wx946e1918a27116a5';
var secret = '0b72f67d7516d5070c287b3520e95cef';

var jscode2session = 'https://api.weixin.qq.com/sns/jscode2session?grant_type=authorization_code&appid='+appid+'&secret='+secret+'&js_code=';

var id2info = 'https://api.weixin.qq.com/sns/userinfo?lang=zh_CN';

var getAccessToken ='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret'+secret;

module.exports={
    jscode2session:jscode2session,
    getAccessToken:getAccessToken,
    id2info:id2info
};