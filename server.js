var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

//나중에 파일을 열기위해 node.js에 내장되어있는 fs모듈을 불러옴
var fs = require("fs");

//서버가 읽을 수 있도록 html의 위치를 정의해준다.
app.set('views',__dirname + '/views');

//서버가 html렌더링을 할 때, EJS엔진을 사용하도록 설정한다.
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);

var server = app.listen(3001,function () {
    console.log("Express server has started on port 3001")
});

//public폴더에 있는 정적 객체들을 사용하겠다(이미지,css 등)
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
    secret : '@#@$MYSIGN#@$#$', //쿠키를 임의로 변조하는 것을 방지하기 위한 sign 값 (원하는 값을 넣으면 됨)
    resave : false, //세션을 언제나 저장할지 정하는 값
    saveUninitialized : true //uninitialized 세션이란 새로 생겼지만 변경되지 않은 세션을 의미
}));

// 라우터 모튤인 main.js.를 불러와서 app에 전달해준다. router에서 fs모듈을 사용할 수 있도록 인자로 추가해준다.
var router = require('./routes/main')(app,fs);
