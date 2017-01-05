const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/chat';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
    'CREATE TABLE chatter(id SERIAL PRIMARY KEY, nick VARCHAR(20) not null)');
  // 'CREATE TABLE chatroom(id SERIAL PRAIMARY KEY, name VARCHAR(40))',
  // 'CREATE TABLE chatroom-users(chatroom_id integer REFERENCE chatroom(id) NOT NULL, user_id integer REFERENCE user(id) NOT NULL)',
  // 'CREATE TABLE message(id SERIAL PRAIMARY KEY, chatroom_id integer REFERENCE chatroom(id) NOT NULL, content VARCHAR(500), date timestamp)');
query.on('end', () => { client.end(); });
