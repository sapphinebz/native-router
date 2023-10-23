const { Subject, Observable } = require("rxjs");
const { mergeMap, tap, takeUntil } = require("rxjs/operators");
const { WebSocketServer } = require("ws");
const fs = require("node:fs");
const path = require("node:path");

class WsDevWeb {
  onSend = new Subject();

  init(port) {
    const refreshHandler = (cur, prev) => {
      if (cur.ctimeMs !== prev.ctimeMs) {
        this.refreshBrowser();
      }
    };
    fs.watchFile(path.join(__dirname, "public", "index.html"), refreshHandler);
    fs.watchFile(path.join(__dirname, "public", "script.js"), refreshHandler);

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

  refreshBrowser() {
    this.onSend.next("refresh");
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

module.exports = WsDevWeb;
