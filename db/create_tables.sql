use sys;
CREATE TABLE users
(
    `Id`         INT PRIMARY KEY UNIQUE auto_increment,
    `username`   varchar(255),
    `password`   varchar(255),
    `nid`        varchar(255) UNIQUE
);

CREATE TABLE accounts
(
    `Id`     INT PRIMARY KEY UNIQUE auto_increment,
    `name`   varchar(255),
    `number` varchar(255),
    `type`   varchar(255)
);

CREATE TABLE user_account
(
    `Id`      INT PRIMARY KEY UNIQUE auto_increment,
    `user`    INT,
    `account` INT
);

CREATE TABLE `user_permission`
(
    `id`         INT PRIMARY KEY UNIQUE auto_increment,
    `user`       INT,
    `account_id` INT,
    `permission` varchar(255)
);

CREATE TABLE `tokens`
(
    `id`            INT PRIMARY KEY UNIQUE auto_increment,
    `user`          INT,
    `created_at`    timestamp,
    `expire_at`     timestamp
);

CREATE TABLE `token_service`
(
    `id`      INT primary key unique auto_increment,
    `token`   INT,
    `service` varchar(255)
);

CREATE TABLE `service_call`
(
    `id`              INT PRIMARY KEY UNIQUE auto_increment,
    `user`            INT,
    `service`         varchar(255),
    `request`         varchar(255),
    `response`        varchar(255),
    `response_status` varchar(255)
);

CREATE UNIQUE INDEX user_token ON tokens(user);
CREATE UNIQUE INDEX service_token ON tokens(token_service);
ALTER TABLE `user_account` ADD FOREIGN KEY (`user`) REFERENCES `users` (`Id`);
ALTER TABLE `user_account` ADD FOREIGN KEY (`account`) REFERENCES `accounts` (`id`);
ALTER TABLE `user_permission` ADD FOREIGN KEY (`user`) REFERENCES `users` (`id`);
ALTER TABLE `user_permission` ADD FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);
ALTER TABLE `tokens` ADD FOREIGN KEY (`user`) REFERENCES `users` (`id`);
ALTER TABLE `token_service` ADD FOREIGN KEY (`token`) REFERENCES `tokens` (`id`);
ALTER TABLE `service_call` ADD FOREIGN KEY (`user`) REFERENCES `users` (`id`);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;