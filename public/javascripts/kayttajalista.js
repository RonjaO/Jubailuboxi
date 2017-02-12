$("#kayttajat").click(function() {
    $.getJSON("/kayttajat", function(data) {
        // console.log("Nappia painettu. Saatiin " + data);

        $.each(data, function(index , item) {  
            console.log("Joku itemi");
                        $("<p/>").text(item.nick).appendTo("#lista");
            console.log(item);
            console.log(item);
            console.log("-----");
        });
        
    });
});

var HOST = location.origin.replace(/^http/, 'ws')
var socket = new WebSocket(HOST, "echo-protocol");
var path = window.location.pathname.split('/');
var chatroom = path[2]

$("#send").click(function() {
    var message = {
        type: "message",
        chatroom: chatroom,
        user: window.jubailuboxi.userId,
        nick: window.jubailuboxi.userNick,
        content: document.getElementById("message").value,
        date: Date.now()
    };
      socket.send(JSON.stringify(message));
      document.getElementById("message").value = "";
})

socket.onmessage = function (event) {
    console.log(event.data);
    
    var message = JSON.parse(event.data);
    
    // Jos serveriltä tullut viesti on ilmoitus yhteyden muodostamisesta, lähetetään takaisin tieto, missä keskusteluhuoneessa ollaan
    if (message.type === 'connection' && message.connection) {
        var joinMessage = {
            type: "join",
            chatroom: chatroom };

        socket.send(JSON.stringify(joinMessage));
        return;
    }

    var time = new Date(message.date);
    var timestring = time.toTimeString().substring(0, 5);
    $("<p/>").text(timestring + " " + message.nick + ": " + message.content).appendTo("#chat");
    
}

$(document).ready(function() {
    console.log(window.jubailuboxi.history);
    $.each(window.jubailuboxi.history, function(index, message) {
        console.log("Viesti: " + message);
        var time = new Date(message.date);
        var timestring = time.toTimeString().substring(0, 5);
        
        $("<p/>").text(timestring + " " + message.nick + ": " + message.content).appendTo("#chat");
        
    });
})
