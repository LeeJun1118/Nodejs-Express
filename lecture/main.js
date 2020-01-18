var http = require("http"); // http 모듈 불러오기
var fs = require("fs");
var event = require("events");
var eventEmitter = new event.EventEmitter();

http.createServer(function (req,res) {
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.end("Hello World\n");
}).listen(8081);

var data = fs.readFileSync('input.txt');

fs.readFile('input.txt',function (err,data) {
    if(err)
        return console.error(err);
    console.log(data.toString());
});


var connectHandler=function connected(){
    console.log("Connnection Successful");
    eventEmitter.emit("data_received");
};
eventEmitter.on('connection',connectHandler);
eventEmitter.on('data_received',function () {
    console.log("Data Received");
})
eventEmitter.emit('connection');
console.log("Program has ended");



//console.log(data.toString());
//console.log("Program has ended");
//console.log("Server running at http://127.0.0.1:8081");
