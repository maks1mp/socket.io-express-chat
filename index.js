var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.get('/', function (req, res) {
    res.sendfile( __dirname + '/index.html');
});
var i=0;
var all_messages = [];

io.on('connection', function (socket) {
    i++;
    socket.emit('news', {'connected': i , 'all_mess': all_messages});
    // socket.broadcast.emit('news', {'connected': i , 'all_mess': all_messages});

    socket.on('send_mess', function (data) {
        
        all_messages.push(data);
        socket.emit('mess', { 'mess': data.text, 'name': data.user_name});
        socket.broadcast.emit('mess', { 'mess': data.text, 'name': data.user_name});

        console.log(data.text);
        
    });
    
    socket.on('disconnect', function () {
        --i;
        socket.emit('user_leave', {'connected': i});
        socket.broadcast.emit('user_leave', {'connected': i });
    });
});
