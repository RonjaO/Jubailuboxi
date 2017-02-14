/**
 * Module dependencies.
 */

var app = require('./app');
var debug = require('debug')('node-postgress-todo:server');
var WebSocketServer = require('websocket').server;
var http = require('http');
var fs = require('fs');
var Message = require('./models/messages');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// List of currently connected clients 
var clients = new Map();

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// Create WeBSocketserver
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);

    // Liitetään uusi käyttäjä chattihuoneeseen 'yleinen'
    clients.set(connection, "/yleinen");
    console.log((new Date()) + ' Connection accepted.');
    
    // Kerrotaan clientille yhteyden muodostuneen
    var connectionMessage = { type: 'connection', connection: true };
    connection.sendUTF(JSON.stringify(connectionMessage));

    // Keskusteluhistorian lähettäminen tässä?

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var jsonMessage = JSON.parse(message.utf8Data);
            // console.log("Viestin tyyppi: " + jsonMessage.type);
            
            if (jsonMessage.type === "join") {
                clients.set(connection, jsonMessage.chatroom);
                console.log("Mentiin chattiin " + jsonMessage.chatRoom);
            } else if (jsonMessage.type === 'message') {
                for (var [client, chatroom] of clients) {
                    if (chatroom === jsonMessage.chatroom) {
                        client.sendUTF(message.utf8Data);
                    }
                }

                // Tallennetaan viesti tietokantaan                
                var msg = new Message(jsonMessage.chatroom, jsonMessage.user, jsonMessage.content, new Date(jsonMessage.date));
                msg.save();
            }
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        // TODO: poista clients-listasta
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

module.exports = server;
