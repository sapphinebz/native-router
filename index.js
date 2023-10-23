const express = require("express");
const WebSocketForDevelop = require("./ws-dev.js");
const path = require("path");
const app = express();
const port = 3000;

const ws = new WebSocketForDevelop();

ws.init(8080);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/ws-dev-script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ws-dev-script.js"));
});

app.get("/script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "script.js"));
});

app.get("**", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
