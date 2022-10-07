CREATE TABLE IF NOT EXISTS Category (
                         id INTEGER NOT NULL AUTO_INCREMENT,
                         categoryName VARCHAR(128) NOT NULL,
                         PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS breeds (
                                        name VARCHAR(128) NOT NULL,
                                        category_id INTEGER NOT NULL,
                                        PRIMARY KEY (name),
                                        FOREIGN KEY(category_id) REFERENCES Category(id)
);