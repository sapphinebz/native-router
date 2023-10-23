const connection = new WebSocket("ws://localhost:8080");
connection.addEventListener("open", () => {
  connection.addEventListener("message", (e) => {
    const msg = e.data;
    if (msg === "refresh") {
      window.location.reload();
    }
  });
});
