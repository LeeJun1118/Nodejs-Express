/*
※※실행※※
node lecture/server.js
새 커맨드 창
node lecture/client.js

*/

var http = require('http');

var options = {
    host : 'localhost',
    port : '8090',
    path : '/lecture/index.html'
};

// callback함수로 response를 받아온다.
var callback = function (response) {
    var body = '';
    response.on('data',function (data) {
        body += data;
    });

    //end 이번트가 감지되면 데이터 수신을 종료하고 내용을 출력한다.
    response.on('end',function () {
        console.log(body);
    });
}
// 서버에 http request를 날린다.
var req = http.request(options,callback);
req.end();