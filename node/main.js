var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var oTemplate = require('./lib/template.js'); 
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var title = queryData.id;

    if (pathName === '/') {
        if (title == undefined) {
            title = 'Welcome';
        }

        fs.readdir('data', function(err, aFlieList){
            var szList = oTemplate.fileList(aFlieList);
            var filteredTitle = path.parse(title).base;
            fs.readFile(`data/${filteredTitle}`, 'utf-8', function(err, description){
                var sanitizedTitle = sanitizeHtml(title);
                console.log(description);
                var sanitizedDescription = sanitizeHtml(description);
                console.log(sanitizedDescription);
                
                var template = oTemplate.HTML(sanitizedTitle, szList, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                `<a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="/delete_process" method="POST"> 
                    <input type="hidden" name="id" value="${sanitizedTitle}" />
                    <input type="submit" value="delete"/>
                </form>`);
                response.writeHead(200);
                response.end(template);
            });
        });
    } else if (pathName == '/create'){
        fs.readdir('data', function(err, aFlieList){
            var szList = oTemplate.fileList(aFlieList);
            fs.readFile('form/form.html', 'utf-8', function (error, data) {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                var template = oTemplate.HTML(title, szList, data, '');
                if (error) {
                    response.writeHead(404);
                    response.write('Whoops! File not found!');
                } else {
                    response.write(template);
                }
                response.end();
            }); 
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
            
            var filteredTitle = path.parse(title).base;
            fs.writeFile(`data/${filteredTitle}`, description, 'utf-8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
    } else if (pathName == '/update') {
        var szList = '';
        fs.readdir('data', function(err, aFlieList){
            szList += oTemplate.fileList(aFlieList);
        });

        var filteredTitle = path.parse(title).base;
        fs.readFile(`data/${filteredTitle}`, 'utf-8', function(err, description){
            response.writeHead(200, {
                'Content-Type': 'text/html'
            });
            var template = oTemplate.HTML(title, szList, 
                `<form action="http://localhost:3000/update_process" method="POST">
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
           response.write(template);
           response.end();
        });
    } else if(pathName == '/update_process') {
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;

            var filteredId = path.parse(id).base;
            var filteredTitle = path.parse(title).base;

            fs.rename(`data/${filteredId}`, `data/${filteredTitle}`, function(err){
                fs.writeFile(`data/${filteredTitle}`, description, 'utf-8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            });
        });
    } else if (pathName == '/delete_process') {
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            
            fs.unlink(`data/${filteredId}`, function(err){
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });   
    } else {
        response.writeHead(404);
        response.end('Not Found ');
    }
    
    // response.end(fs.readFileSync(__dirname + _url));
});
app.listen(3000);