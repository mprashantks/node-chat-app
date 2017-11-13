var socket = io();

function scrollToBottom() {
  //Selectors
  var messages = jQuery('#messages');
  var message = messages.children('li:last-child');
  //Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = message.innerHeight();
  var lastMessageHeight = message.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};


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
  var formattedDate = moment(message.createdAt).format('h:mm a');

  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedDate
  });
  jQuery('#messages').append(html);

  scrollToBottom();

  // var li = jQuery('<li></li>');
  // li.text(`${message.from} ${formattedDate}: ${message.text}`);
  // jQuery('#messages').append(li);
});

//New location
socket.on('newLocationMessage', function (message) {
  var formattedDate = moment(message.createdAt).format('h:mm a');

  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedDate
  });
  jQuery('#messages').append(html);

  scrollToBottom();

  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>');
  //
  // li.text(`${message.from} ${formattedDate}: `);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
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
