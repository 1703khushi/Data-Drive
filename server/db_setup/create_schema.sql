use dfsdata;

DROP TABLE IF EXISTS User_Bucket;

CREATE TABLE User_Bucket (
    user varchar(255),
    bucket_name varchar(255),
    PRIMARY KEY (user)
);
DROP TABLE IF EXISTS Bucket_info;

CREATE TABLE Bucket_info (
    user varchar(255),
    bucket_name varchar(255),
    current_storage FLOAT(0) DEFAULT 0,
    max_storage FLOAT(0) DEFAULT 1000000,
    PRIMARY KEY (bucket_name)
);
DROP TABLE IF EXISTS file_graph;

CREATE TABLE file_graph (
    user varchar(255),
    bucket_name varchar(255),
    id varchar(255),
    folder varchar(255),
    parent_folder varchar(255),
    shared BOOL DEFAULT 0,
    PRIMARY KEY (id)
);
DROP TABLE IF EXISTS shared_folder;

CREATE TABLE shared_folder (
    id varchar(255),
    folder varchar(255),
    creater_bucket varchar(255),
    user varchar(255),
    Upload BOOL DEFAULT 1,
    Download BOOL DEFAULT 1,
    viewothers BOOL DEFAULT 1,
    accepted BOOL DEFAULT 0,
    FOREIGN KEY (id) REFERENCES file_graph(id),
    PRIMARY KEY (id, user)
);


