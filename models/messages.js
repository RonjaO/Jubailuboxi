var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/chat';

function Message(chatroom, userId, content, date) {
    this.chatroom = chatroom;
    this.userId = userId;
    this.content = content;
    this.date = date;
}

Message.findHistory = function(chatroom, callback) {
    console.log("haetaan historia");
    var history = [];
    pg.connect(connectionString, (err, client, done) => {
      // Handle connection errors
        if(err) {
            done();
            console.log(err);
        }
      // SQL Query > Select Data
        const query = client.query('SELECT name, nick, content, date FROM chatroom, users, message WHERE message.chatroom_id=(SELECT id FROM chatroom WHERE name=$1) AND message.chatroom_id=chatroom.id AND message.user_id=users.id', [chatroom]);
      // Stream results back one row at a time
        query.on('row', (row) => {
            history.push(row);
        });
      // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            console.log("Haettiin " + JSON.stringify(history));
            callback(history);
        });
    });
    
};

Message.prototype.save = function() {
    console.log("Aloitetaan viestin tallennus..");
    pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
        if (err) {
            done();
            console.log(err);
        }
        // SQL Query > Insert Data
        const query = client.query('INSERT INTO message(chatroom_id, user_id, content, date) SELECT chat.id, $1, $2, $3 FROM chatroom chat WHERE chat.name=$4', [this.userId, this.content, this.date, this.chatroom]);
        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            console.log("Tallennettiin viesti tietokantaan");
            return this;
        });
    });
    
};

module.exports = Message;
