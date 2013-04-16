// export function for listening to the socket
module.exports = function (socket) {

  socket.on('game:player:join', function(data) {
    console.log('socket event [game:player:join]', data);
    socket.broadcast.emit('game:player:joined');
  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('game:player:left', {
    });
  });

};