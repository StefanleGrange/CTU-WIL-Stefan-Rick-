CREATE DATABASE Realhome_WIL;
USE Realhome_WIL;

CREATE TABLE Agents(
	agent_id integer PRIMARY KEY AUTO_INCREMENT,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	phone_number varchar(10) NOT NULL,
	email varchar(255) NULL,
	Listings text NOT NULL
);

CREATE TABLE Listings(
	listing_id integer PRIMARY KEY AUTO_INCREMENT,
	agent_id integer NOT NULL,
	listing_adress varchar(255) NOT NULL,
	price decimal(10, 2) NOT NULL,
	Bedrooms integer NOT NULL,
	bathrooms integer NULL,
	wishlists text NULL,
	more_info text NULL
);

ALTER TABLE Listings ADD FOREIGN KEY (agent_id) REFERENCES Agents(agent_id);


CREATE TABLE Profiles(
	user_id integer PRIMARY KEY AUTO_INCREMENT,
	first_name varchar(255) NOT NULL,
	last_name varchar(255) NOT NULL,
	phone_number varchar(10) NOT NULL,
	email varchar(255) NOT NULL,
	wishlist text NULL,
	favourites text NULL
);
