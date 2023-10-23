const express = require("express");
const WebWatcher = require("./web-watcher.js");
const path = require("path");
const app = express();
const port = 3000;

const watcher = new WebWatcher();

watcher.init(8080);

app.use(
  "/routes",
  express.static(path.join(process.cwd(), "public", "routes"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

const scripts = ["client-web-watcher.js", "script.js", "router.js"];

for (const sct of scripts) {
  app.get(`/${sct}`, (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", sct));
  });
}

app.get("**", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
