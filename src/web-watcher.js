const { Subject, Observable } = require("rxjs");
const { mergeMap, tap, takeUntil } = require("rxjs/operators");
const { WebSocketServer } = require("ws");
const fs = require("node:fs");
const path = require("node:path");

class WebWatcher {
  onSend = new Subject();

  #refreshHandler = (cur, prev) => {
    if (cur.ctimeMs !== prev.ctimeMs) {
      this.onSend.next("refresh");
    }
  };

  init(port) {
    this.watchChange(path.join(process.cwd(), "public"));

    const wsServer = new WebSocketServer({
      port,
    });
    this.fromWSServer(wsServer, "connection")
      .pipe(
        mergeMap((ws) => {
          const onClientClose = this.fromWsClient(ws, "close");
          return this.onSend.pipe(
            tap((msg) => {
              ws.send(msg);
            }),
            takeUntil(onClientClose)
          );
        })
      )
      .subscribe();
  }

  /**
   *
   * @param {import("node:fs").PathLike} pathLike
   */
  watchChange(pathLike) {
    fs.readdir(pathLike, { recursive: true }, (err, files) => {
      for (const file of files) {
        if (path.parse(file).ext === "") {
          this.watchChange(path.join(pathLike, file));
        } else {
          const filePath = path.join(pathLike, file);
          console.log("watching", filePath.toString());

          const ref = fs.watchFile(filePath, this.#refreshHandler);
        }
      }
    });
  }

  /**
   * @param {WebSocketServer} wss
   * @param {string} eventName
   * @returns Observable
   */
  fromWSServer(wss, eventName) {
    return new Observable((subscriber) => {
      const handler = subscriber.next.bind(subscriber);
      wss.on(eventName, handler);
      subscriber.add(wss.off.bind(wss, eventName, handler));
    });
  }

  /**
   *
   * @param {WebSocket} ws
   * @param {string} eventName
   */
  fromWsClient(ws, eventName) {
    return new Observable((subscriber) => {
      const handler = subscriber.next.bind(subscriber);
      ws.on(eventName, handler);
      subscriber.add(ws.off.bind(ws, eventName, handler));
    });
  }
}

module.exports = WebWatcher;
