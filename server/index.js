const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const route = require("./src/routes");
const cookieParse = require("cookie-parser");
const errorHandler = require("./src/middleware/error-handler");
const http = require("http");
const server = http.createServer(app);
const socket = require("./src/module/socket");
const { transporter } = require("./src/utils/nodemailer");

const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:4200"],
  credentials: true,
};

const path = require("path");
app.set("views", path.join(__dirname, "src", "view"));
app.set("view engine", "ejs");

app.use(cors(corsOptions));
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParse());

// custom middleware
app.use(errorHandler);

route(app);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

socket.init(server);

const port = process.env.PORT || 4000;

server.listen(port, () =>
  console.log(`Example app listening on http://localhost:${port}`)
);
