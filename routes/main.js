// server.js에서 모듈로서 불러올 수 있도록 사용된다.
module.exports = function (app, fs) {

    app.get('/', function (req, res) {

        //메인 페이지에서 세션을 조회 할 수 있도록 변수 설정
        var sess = req.session;

        //json데이터를 render메소드의 두번째 인자로 전달하여 페이지에서 데이터를 사용가능하게 됨
        res.render('index', {
            title: "MY HOMEPAGE",
            length: 5,
            name: sess.name,
            username: sess.username
        })
    });

    app.get('/list', function (req, res) {
        fs.readFile(__dirname + "/../data/" + "user.json", 'utf8', function (err, data) {
            console.log(data);
            res.end(data);
        })
    });

    app.get('/getUser/:username', function (req, res) {
        //파일 읽기
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            //유저를 찾으면 유저 데이터를 출력하고 없으면 {} 을 출력한다.
            //fs.readFile()로 파일을 읽었을 시엔 텍스트 형태로 읽어지기 때문에, JSON.parse()를 해야한다.
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
        });
    });

    app.post('/addUser/:username', function (req, res) {
        var result = {};
        var username = req.params.username;

        // 요청 유효성 검사
        if (!req.body["password"] || !req.body["name"]) {
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // 데이터 로드, 중복 검사
        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            if (users[username]) {
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // 데이터에 추가
            users[username] = req.body;

            // 데이터 저장
            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), "utf8", function (err, data) {
                result = {"success": 1};
                res.json(result);
            })
        })
    })


    app.put('/addUser/:username', function (req, res) {
        var result = {};
        var username = req.params.username;

        if (!req.body["password"] || !req.body["name"]) {
            result["success"] = 0;
            result["error"] = 0;
            res.json(result);
            return;
        }

        fs.readFile(__dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            users[username] = req.body;

            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', function (err, data) {
                result = {"success": 1};
                res.json(result);
            })
        })
    })

    app.delete('/deleteUser/:username', function (req, res) {
        var result = {};
        fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
            var users = JSON.parse(data);

            if (!users[req.params.username]) {
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            delete users[req.params.username];

            fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(users, null, '\t'), 'utf8', function (err, data) {
                result["success"] = 1;
                res.json(result);
                return;
            })

        })
    })

    //로그인시에 user.json에 정보가 입력되어 있어야함
    //http://localhost:3001/login/ljun/123
    app.get('/login/:username/:password', function (req, res) {
        var sess;
        sess = req.session;

        fs.readFile(__dirname + "/../data/user.json", "utf8", function (err, data) {
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};

            if (!users[username]) {
                //유저 이름이 없다면
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            //로그인에 성공하면 세션에 username과 name을 저장
            if (users[username]["password"] == password) {
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);
            } else {
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }

        })

    });

    //로그아웃을 하고 메인 페이지로 redirect 된다.
    app.get('/logout', function (req, res) {
        sess = req.session;
        if (sess.username) {
            req.session.destroy(function (err) {
                if(err)
                    console.log(err);
                else
                    res.redirect('/');
            })
        }
        else
            res.redirect('/');
    })

};