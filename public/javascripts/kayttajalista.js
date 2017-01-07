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
// exampleSocket.connect

$("#send").click(function() {
    var message = {
        type: "message",
        content: document.getElementById("message").value,
        date: Date.now()
    };
      socket.send(JSON.stringify(message));
      document.getElementById("message").value = "";
})

socket.onmessage = function (event) {
    console.log(event.data);
    
    var message = JSON.parse(event.data);
    var time = new Date(message.date);
    var timestring = time.toTimeString().substring(0, 5);
$("<p/>").text(timestring + " - " + message.content).appendTo("#chat");
    
}

