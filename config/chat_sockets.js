//server side ; backend
//this receives a req for connection from user(subscriber)

module.exports.chatSockets = function(socketServer){
    // let io = require('socket.io')(socketServer);  //io(global variable retrieved from cdn has all the sockets; )

     // Set up the Socket.IO server with the CORS settings
     const io = require('socket.io')(socketServer, {
        cors: {
            origin: 'http://localhost:8000', // Allow requests from this origin (client-side URL)
            credentials: true // Allow cookies and other credentials in CORS requests
        }
    });

    io.sockets.on('connection', function(socket){
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected');
        });

        socket.on('join_room', function(data){
            console.log('joining request received', data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', data);
        });

        //:: CHANGE
        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

    });

}