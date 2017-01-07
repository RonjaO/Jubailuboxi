CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    nick varchar(20) NOT NULL
);

CREATE TABLE chatroom(
    id SERIAL PRIMARY KEY,
    name varchar(30) NOT NULL,
    description varchar(300)
);

CREATE TABLE chatroom_users(
    chatroom_id integer REFERENCES chatroom(id) NOT NULL,
    user_id integer REFERENCES users(id) NOT NULL
);

CREATE TABLE message(
    id SERIAL PRIMARY KEY,
    chatroom_id integer REFERENCES chatroom(id),
    user_id integer REFERENCES users(id),
    content varchar(500),
    date timestamp
);
