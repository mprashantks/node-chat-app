var socket = io();

socket.on('connect', function () {
  console.log('Connected to server');

  socket.on('newMessage', function (message) {
    console.log('New message: ', message);
  });

  socket.emit('createMessage', {
    from: 'abhishek',
    text: 'Hello from client'
  });
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});
