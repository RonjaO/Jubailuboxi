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
