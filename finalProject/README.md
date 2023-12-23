# TODO LIST

### Video Demo: https://youtu.be/hDpEoftqskg

### Description:
The application is a web-based solution implemented with JavaScript and SQL. Primarily designed as a "to-do list" application, users can create and manage lists, along with corresponding tasks or list items. Functionality includes the ability to edit, delete, view, and mark items or lists as complete.

User interaction is streamlined through a registration and login system. Regular users have exclusive access to their personalized lists and tasks, equipped with the above-mentioned functionalities. In contrast, administrators possess privileges, enabling them to oversee all users' lists and tasks, inclusive of pertinent details. The administrative dashboard further facilitates the viewing of all users through a dedicated "Users" menu. Within this interface, administrators gain access to comprehensive user information, excluding sensitive password details. Additionally, administrators retain the authority to selectively delete user accounts as deemed necessary.

### Steps to Run the Application:
After having installed a MySQL instance (XAMPP, MySQL Server e.t.c) import the schema that is located in the database-schema folder.

Next in the server folder navigate
Server -> services -> data.service.js
and fill in your database's information (host, port, username, password e.t.c)

##### Requirements
If you don't have node installed you should install it
Recommended
Node v16.19.0 - https://nodejs.org/en/blog/release/v16.19.0

if you don't have angular cli you should install it

##### Server
Navigate to server root path in a terminal and execute

npm install

to install all the dependencies you need.

Then in terminal run

node app.js

to execute your server application

##### Web App
Navigate to web-client root path in a terminal and execute

npm install

to install all the dependencies you need.

Then in terminal run

ng serve

to execute your web-client application