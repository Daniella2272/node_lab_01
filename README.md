#Raw Node.js HTTP Server

##What It Does

This project is a simple HTTP server made with Node.js. It does not use Express or any other external packages.

The server can:

* Serve the home page at GET /
* Serve the users page at GET /users
* Receive a username using POST /create-user
* Redirect the user back to / after submitting the form
* Return 404 when a route does not exist
* Return 405 when the wrong method is used
* Return 500 if a file cannot be read
* Reject request bodies larger than 1 MB

##How to Run

Make sure Node.js is installed.

Run:

npm start

The server will run on port 3000.

Open:

http://localhost:3000

##Environment Variables

No environment variables are needed for this project.

##Endpoints

Method	Route	Description
GET	/	Serves index.html
GET	/users	Serves users.html
POST	/create-user	Receives the username and redirects to /

##Why is the response sent inside the end handler?

The request body may come in different parts, so we cannot assume that everything will be received at once.

The data event receives the different parts of the request body, while the end event tells us that all the data has been received.

Because of this, the response is sent inside the end handler. This makes sure we have received the complete username before processing it and sending the response.

Node.js uses an event-driven event loop, so the server handles these events as the data comes in instead of waiting for everything at once.

##What Would Express Replace?

###server.js

Express would make the routing and request handling easier. Instead of checking the method and URL ourselves, we could use Express routes to handle requests like GET /, GET /users, and POST /create-user.

###index.html

The index.html file would still contain the form. Express would just make serving the file easier.

###users.html

The users.html file would still contain the list of users. Express could serve the file instead of using fs.readFile() ourselves.

###package.json

Express would be added as a dependency in package.json if we were using it. However, this lab requires us to use Node.js core modules without Express.

##Known Limitations

The usernames submitted through the form are only logged in the server console. They are not saved permanently.

The users page also uses a static list of users.