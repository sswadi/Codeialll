//frontend; browser;client-user
//this class sends a req for connection

class ChatEngine{
    constructor(chatBoxId, userEmail){  //takes in 2 args ie. chat box id, and email to identify the user
        this.chatBoxId = $(`#${chatBoxId}`);  //#is a css selector(id); $ is a jquery selector function used to manipulate DOM that returns an object
        // The value of chatBoxId is inserted in place of chatBoxId using the ${...} syntax.
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');   //io is a global variable that has been given to us by cdn that we have included in home.ejs(https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js)
//basically io.connect fires an event called connection(present in chat_sockets.js file- server side)
        
        if(this.userEmail){
            this.connectionHandler();
        }


    }

    connectionHandler(){ //connectionHandler detects if a connection has been establshed b/w subscriber and observer
        //this connection handler will have the to-and-fro interaction b/w the server(observer) and user(subsciber)

        let self = this;


        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}