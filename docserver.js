const http = require('http');
const fs = require('fs');
var server = http.createServer(function (req, res) {
    if (req.url !== "/favicon.ico") {
        if (req.method.toLowerCase() == 'post') {
            var chunks = [];
            let num = 0;
            req.on('data', (chunk) => {
                chunks.push(chunk);
                num += chunk.length;
            })

            req.on('end', () => {
                console.log(chunks);
                console.log(num);
                var buffer = Buffer.concat(chunks, num);
                console.log(buffer.toString('utf-8'));
                var rems = [];
                for (var i = 0; i < buffer.length; i++) {
                    var v = buffer[i];
                    var v2 = buffer[i + 1];
                    if (v == 13 && v2 == 10) {
                        rems.push(i);
                    }
                }
                let information = buffer.slice(rems[0] + 2, rems[1]).toString();
                let name = information.match(/filename=".*"/)[0].split('"')[1];
                let content = buffer.slice(rems[3] + 2, rems[rems.length - 2]);
                fs.writeFile('./myfile/' + name, content, 'utf-8', (err) => {
                    if (err) {
                        console.log('write faild');
                    } else {
                        console.log('write saved');
                    }
                });
                res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8' })
                res.end('success');
            })
            res.end();
        }
    }
}).listen(8080);