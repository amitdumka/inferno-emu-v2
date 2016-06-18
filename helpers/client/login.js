/*
 * login.js - Handles client from login server
 */

'use strict';

var packet = require(__dirname + '/../packet.js');
var hexy = require('hexy');

module.exports = function (server, socket) {
  // Data receive handler
  socket.on('data', function (data) {
    switch (data.length) {
      case packet.identifier.login.len.GAME_SERVER_DETAILS_REQUEST:
        //@todo Handle sending server details request
        break;
      case packet.identifier.login.len.USER_CREDENTIALS:
        var credentials = packet.helper.getParsedCredentials(data);
        server.db.validateCredentials(credentials.username, credentials.password, function(rows) {
          if (rows.length == 0) {
            socket.write(packet.helper.getPreLoginMessagePacket('Invalid user ID/password!'));
          } else {
            //@todo Send game server info
            socket.write(packet.helper.getPreLoginMessagePacket('Thanks for logging in!'));
          }
        });
        break;
      default:
        console.log('Login server received unknown packet from client with length ' + data.length);
        console.log(hexy.hexy(data));
        break;
    }
  });
  // Connection close handler
  socket.once('close', function() {
    console.log('Connection closed from ' + socket.remoteAddress);
  });
  // Connection error handler
  socket.on('error', function() {
    console.log('Connection error from ' + socket.remoteAddress);
  });
};
