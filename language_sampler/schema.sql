-- Create stimuli table
DROP TABLE IF EXISTS stimuli;
CREATE TABLE stimuli (
	id integer primary key autoincrement,
	description text not null,
	source text not null
	);


INSERT INTO stimuli (description, source) VALUES
	('shopping dog', 'dog_shopping.png'), 
	('puppy mischief', 'puppy_heel.jpg');

-- Create user table table
-- DROP TABLE IF EXISTS stimuli;
-- CREATE TABLE stimuli (
-- 	id integer primary key autoincrement,
-- 	name text not null,
-- 	source text not null
-- 	);
