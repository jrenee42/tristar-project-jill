# tristar-project-jill


1. prereqs
   a. MySQL
   b. python
   c. flask
   d. nvm/npm
   


Mysql: (in my installation: pw: root12345 )
1. start the server:
 sudo /usr/local/mysql/support-files/mysql.server start
 (use the system password, not the mysql password for this)
 2. connect to the database:
 /usr/local/mysql/bin/mysql -u root -p
 (this time, use the mysql pw: root12345)

3.  create the tables in the sql database:




CREATE DATABASE tristar;
use tristar;
CREATE TABLE workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_name VARCHAR(255)
);
CREATE TABLE workout_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_id INT,
    date DATE,
    duration_minutes INT,
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
);

put some data into it for bootstrapping:

INSERT INTO workouts (workout_name) VALUES
('swimming'),
('running'),
('bicycling'),
('e-bicycling'),
('walking'),
('hiking'),
('rowing'),
('tennis');


4.  setup flask/python:



/usr/local/bin/pip3 install mysql-connector-python

5. flask/python:
jill@jills-air tristar % cd flask-server
jill@jills-air flask-server % source venv/bin/activate

(venv) jill@jills-air flask-server % flask --app server run





>>>>>>
jill@jills-air flask-server % source venv/bin/activate

to run it:
pip3 install mysql-connector-python  (NOT mysql.connector)
(venv) jill@jills-air flask-server % python3 server.py


run the frontend:

npm start in th eclient dir
