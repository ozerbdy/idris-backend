const _ = require('lodash');
const TypeHelpers = require('../helpers/typeHelpers');
const UserRepository = require('../db/UserRepository');

let io;
let clients = {};

module.exports.initalizeEventListeners = function(socketIO){
    socketIO.on("connection", async function (socket) {
        console.log("A Client Connected!", socket.id, "to process with pid:",`${process.pid}`);
        const token = socket.request.headers.token;
        console.log("client trying to authenticate", token);
        if(TypeHelpers.isNotEmptyString(token)){
            try {
                const user = await UserRepository.get(token);
                const userId = user._id.toString();
                socket.userId = userId;
                socket.join(userId);
                clients[userId] = socket;
                console.log("user successfully authenticated token", token, "userId", userId);
            }catch(err){
                socket.disconnect();
            }
        }else{
            socket.disconnect();
        }
        socket.on('disconnect', function () {
            console.log('A Client Get Disconnected', socket.id, "from process with pid:", `${process.pid}`);
            if(socket.userId){
                delete clients[socket.userId];
                console.log("disconnected user ", socket.userId, "deleted");
            }
        });
    });
    io = socketIO;
    module.exports.io = io;
};


module.exports.emitEvent = function(eventName, data){
    if(clients[userId]) {
        const socket = clients[userId];
        if(socket){
            socket.emit(eventName, data);
        }
    }
};

module.exports.broadcastOnlineExceptUser = function(userId ,eventName, data){
    if(clients[userId]){
        const socket = clients[userId];
        if(socket){
            socket.broadcast.emit(eventName, data);
        }
    }
};

