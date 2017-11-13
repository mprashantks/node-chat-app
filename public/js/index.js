var socket = io();

//Event when server gets connected
socket.on('connect', function () {
  console.log('Connected to server');
});

//Event when server disconnects
socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

//Event of new message
socket.on('newMessage', function (message) {
  console.log('New message: ', message);

  var li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});

//Event when send-button is pressed to send message
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });
});
