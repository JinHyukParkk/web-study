var fs = require('fs');

console.log('a');
var result = fs.readFileSync('./sync/test.txt', 'utf-8');
console.log(result);
console.log('c');

console.log('#############');
console.log('a');
fs.readFile('./sync/test.txt', 'utf-8', function(err, result){
    console.log(result);
});
console.log('c');

console.log('#############');
var a = function() {
    console.log('A');
}

function slowfunc(callback){
    callback();
}

slowfunc(a);