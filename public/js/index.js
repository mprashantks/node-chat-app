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

//New location
socket.on('newLocationMessage', function (message) {
  console.log('Location: ', message);

  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

//Event when send-button is pressed to send message
jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('');
  });
});

//Send location
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if(! navigator.geolocation) {
    return alert('Geolocation feature not available');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location ...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      from: 'Admin',
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to get location');
  });
});
