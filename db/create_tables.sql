use sys;
CREATE TABLE users
(
    `Id`         INT PRIMARY KEY UNIQUE auto_increment,
    `username`   varchar(255),
    `password`   varchar(255),
    `account`    INT,
    `permission` INT
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

CREATE TABLE `permissions`
(
    `id`   INT PRIMARY KEY UNIQUE auto_increment,
    `name` varchar(255)
);

CREATE TABLE `user_permission`
(
    `id`         INT PRIMARY KEY UNIQUE auto_increment,
    `user`       INT,
    `permission` INT
);

CREATE TABLE `tokens`
(
    `id`            INT PRIMARY KEY UNIQUE auto_increment,
    `user`          INT,
    `token_service` INT,
    `created_at`    timestamp,
    `expire_at`     timestamp
);

CREATE TABLE `token_service`
(
    `id`      INT primary key unique auto_increment,
    `token`   INT,
    `service` INT
);

CREATE TABLE `services`
(
    `id`   INT PRIMARY KEY UNIQUE auto_increment,
    `name` varchar(255)
);

CREATE TABLE `service_call`
(
    `id`              INT PRIMARY KEY UNIQUE auto_increment,
    `user`            INT,
    `service`         INT,
    `request`         varchar(255),
    `response`        varchar(255),
    `response_status` varchar(255)
);

CREATE UNIQUE INDEX account ON users(account);
CREATE UNIQUE INDEX account ON user_account(account);
CREATE UNIQUE INDEX permission ON users(permission);
CREATE UNIQUE INDEX permission ON user_permission(permission);
CREATE UNIQUE INDEX user_token ON tokens(user);
CREATE UNIQUE INDEX service_token ON tokens(token_service);
ALTER TABLE `user_account` ADD FOREIGN KEY (`user`) REFERENCES `users` (`account`);
ALTER TABLE `user_account` ADD FOREIGN KEY (`account`) REFERENCES `accounts` (`id`);
ALTER TABLE `user_permission` ADD FOREIGN KEY (`user`) REFERENCES `users` (`permission`);
ALTER TABLE `permissions` ADD FOREIGN KEY (`id`) REFERENCES `user_permission` (`permission`);
ALTER TABLE `tokens` ADD FOREIGN KEY (`user`) REFERENCES `users` (`id`);
ALTER TABLE `token_service` ADD FOREIGN KEY (`token`) REFERENCES `tokens` (`token_service`);
ALTER TABLE `token_service` ADD FOREIGN KEY (`service`) REFERENCES `services` (`id`);
ALTER TABLE `service_call` ADD FOREIGN KEY (`user`) REFERENCES `users` (`id`);
ALTER TABLE `service_call` ADD FOREIGN KEY (`service`) REFERENCES `services` (`id`);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;