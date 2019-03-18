module.exports = {
    HTML:function(title, szList, body, szControl) {
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
    },
    fileList:function(aFlieList) {
        var szList = '<ul>';
        aFlieList.forEach(element => {
            if(element != 'Welcome'){
                szList += `<li><a href="./?id=${element}">${element}</a></li>`
            }
        });
        szList += '</ul>';
        return szList;
    }
}