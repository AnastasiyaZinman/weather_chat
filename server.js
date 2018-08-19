var express = require('express');
var app = express();
// app.get('/', function(request, response){ //<== this will catch the first page due to "/"
// });
app.get('/apidemo', function(request, response){
  console.log("This will only be consoled in the node and not browser");
  response.send('This is my html in browser, no answer browser will wait')
});
app.use(express.static('public'));//This will make sure public goes first (if there is index.html)
app.use(express.static('node_modules'));

app.listen(8080,function(){
    console.log("Hello server");
});