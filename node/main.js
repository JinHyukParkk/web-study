var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHtml(title, szList, body, szControl) {
    return `<!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>  
    <body>
    <h1><a href="/">WEB</a></h1>
    ${szList}
    ${szControl}
    ${body}
    </p>
    </body>
    </html>
    `;
}

function templateFileList(aFlieList) {
    var szList = '<ul>';
    aFlieList.forEach(element => {
        if(element != 'Welcome'){
            szList += `<li><a href="./?id=${element}">${element}</a></li>`
        }
    });
    szList += '</ul>';
    return szList;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var title = queryData.id

    if (pathName === '/') {
        if (title == undefined) {
            title = 'Welcome';
        }

        var szList = '';
        fs.readdir('data', function(err, aFlieList){
            szList += templateFileList(aFlieList);
        });
        
        fs.readFile(`data/${title}`, 'utf-8', function(err, description){
            var template = templateHtml(title, szList, `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
            response.writeHead(200);
            response.end(template);
        });
    } else if (pathName == '/create'){
        var szList = '';
        fs.readdir('data', function(err, aFlieList){
            szList += templateFileList(aFlieList);
        });
        
        fs.readFile('form/form.html', 'utf-8', function (error, data) {
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var template = templateHtml(title, szList, data,
           '');
            if (error) {
                response.writeHead(404);
                response.write('Whoops! File not found!');
            } else {
                response.write(template);
            }
            response.end();
        }); 
    } else if (pathName == '/create_process') {
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            
            fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
        
    } else if (pathName == '/update') {
        var szList = '';
        fs.readdir('data', function(err, aFlieList){
            szList += templateFileList(aFlieList);
        });
        fs.readFile(`data/${title}`, 'utf-8', function(err, description){
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var template = templateHtml(title, szList, 
                `<form action="http://localhost:3000/create_process" method="POST">
                <input type="hidden" name="id" value="${title}"/>
                <p>
                    <input type="text" name="title" value="${title}">
                </p>
                <textarea name="description">
                ${description}
                </textarea>
                <p>
                    <input type="submit">
                </p>
            </form>`,
           '');
           console.log(template);
           response.write(template);
           response.end();
        });
    } else if(pathName == '/update_process') {
        
    } else {
        response.writeHead(404);
        response.end('Not Found ');
    }
    
    // response.end(fs.readFileSync(__dirname + _url));
});
app.listen(3000);