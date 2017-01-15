var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/chat';

function User() {
    this.id = null;
    this.nick = null;
}

User.findOne = function(id) {
    pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
        if (err) {
            done();
            console.log(err);
        }
         // SQL Query > Select Data
        const query = client.query('SELECT * FROM users WHERE id=$1', [id]);
        // Stream results back one row at a time
        query.on('row', (row, result) => {
            result.addRow(row);
        });
        // After all data is returned, close connection and return results
        query.on('end', (result) => {
            console.log("Käyttäjä " + JSON.stringify(result.rows));
            done();
            if (result.rows.length > 0) {
                var user = result.rows[0];
                this.id = user.id;
                this.nick = user.nick;
                return this;
            } else {
                return null;
            }
        });
    });
};

User.prototype.save = function() {
    pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
        if (err) {
            done();
            console.log(err);
        }
        // SQL Query > Select Data
        const query = client.query('INSERT INTO users(id, nick) SELECT $1, $2 WHERE NOT EXISTS (SELECT id FROM users WHERE id=$3) RETURNING id', [this.id, this.nick, this.id]);
        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            console.log("Tallennettiin käyttäjä id:llä " + this.id);
            return this;
        });
    });
};

User.update = function(id, nick) {
    this.id = id;
    this.nick = nick;
    console.log("Nimimerkiksi " + this.nick);
    pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
        if (err) {
            done();
            console.log(err);
        }
        // SQL Query > Select Data
        const query = client.query('UPDATE users SET nick=$2 WHERE id=$1', [this.id, this.nick]);
        // After all data is returned, close connection and return results
        query.on('end', () => {
            done();
            console.log("Tallennettiin käyttäjä id:llä " + this.id);
            return this;
        });
    });
};


module.exports = User;


// module.exports = {
//     id: null,
//     nick: null,
//
//     findOne: function(id) {
//         pg.connect(connectionString, (err, client, done) => {
//           // Handle connection errors
//             if (err) {
//                 done();
//                 console.log(err);
//             }
//           // SQL Query > Select Data
//             const query = client.query('SELECT * FROM users WHERE id=$1', [id]);
//           // Stream results back one row at a time
//             query.on('row', (row, result) => {
//                 result.addRow(row);
//             });
//           // After all data is returned, close connection and return results
//             query.on('end', (result) => {
//                 console.log("Käyttäjä " + JSON.stringify(result.rows));
//                 done();
//                 if (result.rows.length > 0) {
//                     var user = result.rows[0];
//                     this.id = user.id;
//                     this.nick = user.nick;
//                     return this;
//                 } else {
//                     return null;
//                 }
//             });
//         });
//
//     },
//
//     save: function() {
//         pg.connect(connectionString, (err, client, done) => {
//           // Handle connection errors
//             if (err) {
//                 done();
//                 console.log(err);
//             }
//           // SQL Query > Select Data
//             const query = client.query('INSERT INTO users(id, nick) VALUES($1, $2)', [this.id, this.nick]);
//           // After all data is returned, close connection and return results
//             query.on('end', () => {
//                 done();
//                 console.log("Tallennettiin käyttäjä id:llä " + this.id);
//                 return this;
//             });
//         });
//     }
// };
//
