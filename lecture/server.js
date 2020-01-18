var http = require('http');
var fs = require('fs');
var url = require('url');

/*
※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
클라이언트에서 서버에 접속을 하면 url에서 열고자 하는 파일을 파싱하여 열어준다.
파일이 존재하지 않는다면 콘솔에 에러 메지시를 출력한다.
※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※

※※실행※※
node lecture/server.js
*/

// 서버 생성
http.createServer(function (req,res) {
    // url 뒤에 있는 디렉토리/파일 이름 파싱
    var pathname = url.parse(req.url).pathname;

    console.log("Request for" + pathname + " received");

    //파일 이름이 비어있다면 index.html로 설정
    if(pathname == "/"){
        pathname = "/lecture/index.html";
    }

    // 파일 읽기
    fs.readFile(pathname.substr(1),function (err,data) {
        if (err){
            console.log(err);
            //페이지를 찾을 수 없음
            //http status : 404 : not found
            //content type : text/plain
            res.writeHead(404,{'Content-Type': 'text/html'});
        }
        else {
            //페이지를 찾음
            // Http status : 200 : Ok
            //content type : text/plain
            res.writeHead(200,{'Content-Type': 'text/html'});

            // 파일을 읽어와서 responseBody에 작성
            res.write(data.toString());
        }
        res.end();
    });
}).listen(8090);

console.log('Server running at http://127.0.0.1:8090');
