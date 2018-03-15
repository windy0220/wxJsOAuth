var wx = {};
//=======================================你需要修改的内容======================================
//参数设置
//*请在公众号后台网页授权中填写 www.你要授权的域名.com
wx.appid = "####"; //公号appid
wx.secret = "####"; //公号secret
wx.turnlink = "http://www.bigma.cc/"; //授权后重定向的回调链接地址
wx.scope = "snsapi_userinfo"; //snsapi_base OR snsapi_userinfo
wx.state = ""; //重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
//=============================================================================================

//debug 用于输出调试
var debug = {};
debug.output = function(msg) {
    console.log(msg);
};

//授权获取code
wx.wxsq = function(appid) {
    redirect_uri = wx.turnlink;
    response_type = 'code'; //返回类型，请填写code
    scope = wx.scope;
    state = '';
    url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=' + response_type + '&scope=' + scope + '&state=' + state + '#wechat_redirect';
    window.location.href = url;
};
//授权获取用户信息
wx.getUserInfo = function(appid, secret, code) {
    $.ajax({
        async: false,
        url: "wxJsOAuth/OAuth.php",
        type: "GET",
        dataType: "json",
        data: {
            code: code,
            appid: appid,
            secret: secret
        },
        timeout: 5000,
        success: function(result) {
            callback(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            debug.output(textStatus);
        }
    });
};

//执行
(function() {
    var code = GetQueryString("code");
    var state = GetQueryString("state");
    debug.output(code);

    if (code !== null) {
        debug.output("获取code成功");
        user = wx.getUserInfo(wx.appid, wx.secret, code);
    } else {
        debug.output("进行调转授权");
        wx.wxsq(wx.appid);
    }
})();

//callback函数 可用此函数为页面的填充内容
function callback(result) {
    if (typeof(result.openid) === "undefined") {
        debug.output("未获取到用户信息，从新跳转授权");
        wx.wxsq(wx.appid);
    } else {
        debug.output("返回用户信息成功！");
        debug.output(result);
        $(".openid").html(result.openid);
        $(".nickname").html(result.nickname);
        $(".sex").html(result.sex);
        $(".province").html(result.province);
        $(".city").html(result.city);
        $(".headimgurl").attr("src", result.headimgurl);
    }
}

// 获取地址栏参数函数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}
