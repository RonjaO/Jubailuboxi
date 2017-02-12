CREATE TABLE users(
    id decimal PRIMARY KEY,
    nick varchar(20) UNIQUE
);

CREATE TABLE chatroom(
    id SERIAL PRIMARY KEY,
    name varchar(30) NOT NULL,
    description varchar(300)
);

CREATE TABLE message(
    id SERIAL PRIMARY KEY,
    chatroom_id integer REFERENCES chatroom(id),
    user_id decimal REFERENCES users(id),
    content varchar(500),
    date timestamp
);
