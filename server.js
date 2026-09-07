const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const querystring = require("querystring");

const maxBodySize = 1024 * 1024;
const PORT = 3000;
const server = http.createServer((req, res) => {

  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  const pathname = requestUrl.pathname;

  // Reject attempts to access paths outside the lab directory.

  if (pathname.includes("..")) {

    res.writeHead(404, { "Content-Type": "text/plain" });

    res.end("Not Found");

    return;

  }

  // GET /

  if (pathname === "/" && req.method === "GET") {

    const filePath = path.join(__dirname, "index.html");

    fs.readFile(filePath, "utf8", (error, data) => {

      if (error) {

        res.writeHead(500, { "Content-Type": "text/plain" });

        res.end("Internal Server Error");

        return;

      }

      res.writeHead(200, { "Content-Type": "text/html" });

      res.end(data);

    });

    return;

  }

  // GET /users

  if (pathname === "/users" && req.method === "GET") {

    const filePath = path.join(__dirname, "users.html");

    fs.readFile(filePath, "utf8", (error, data) => {

      if (error) {

        res.writeHead(500, { "Content-Type": "text/plain" });

        res.end("Internal Server Error");

        return;

      }

      res.writeHead(200, { "Content-Type": "text/html" });

      res.end(data);

    });

    return;

  }

  // POST /create-user

  if (pathname === "/create-user" && req.method === "POST") {

    let body = "";

    let bodyTooLarge = false;

    req.on("data", (chunk) => {

      if (bodyTooLarge) {

        return;

      }

      body += chunk.toString();

      if (Buffer.byteLength(body) > MAX_BODY_SIZE) {

        bodyTooLarge = true;

        res.writeHead(413, { "Content-Type": "text/plain" });

        res.end("Payload Too Large");

        req.destroy();

      }

    });

    req.on("end", () => {

      if (bodyTooLarge) {

        return;

      }

      const formData = querystring.parse(body);

      const username = formData.username;

      if (!username || username.trim() === "") {

        console.log("Username not provided");

      } else {

        console.log("Username:", username);

      }

      res.writeHead(302, {

        Location: "/"

      });

      res.end();

    });

    return;

  }

  // Known paths with the wrong HTTP method

  if (

    pathname === "/" ||

    pathname === "/users" ||

    pathname === "/create-user"

  ) {

    res.writeHead(405, { "Content-Type": "text/plain" });

    res.end("Method Not Allowed");

    return;

  }

  // Unknown route

  res.writeHead(404, { "Content-Type": "text/plain" });

  res.end("Not Found");

});

server.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});

// Shut down cleanly when Ctrl+C is pressed

process.on("SIGINT", () => {

  console.log("\nShutting down server...");

  server.close(() => {

    console.log("Server closed.");

    process.exit(0);

  });

})