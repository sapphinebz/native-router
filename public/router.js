export class Router {
  trash = [];
  routes;
  init(routes) {
    this.routes = routes;
    const routerLinks = document.querySelectorAll("a[routerLink]");
    for (const rlink of routerLinks) {
      const clickHandler = (event) => {
        event.preventDefault();
        const route = event.target.getAttribute("href");
        this.navigate(route);
      };
      rlink.addEventListener("click", clickHandler);
      this.trash.push(
        rlink.removeEventListener.bind(rlink, "click", clickHandler)
      );
    }

    const popStateHandler = (event) => {
      this.navigate(event.state.route, false);
    };

    window.addEventListener("popstate", popStateHandler);
    this.trash.push(
      window.removeEventListener.bind(window, "popstate", popStateHandler)
    );

    this.navigate(location.pathname);
  }

  navigate(route, addToHistory = true) {
    const main = document.querySelector("main");
    main.innerHTML = "";
    for (const _route of this.routes) {
      if (_route.path === route && _route.redirectTo) {
        route = _route.redirectTo;
        continue;
      } else if (route === _route.path) {
        main.appendChild(new _route.component());
        break;
      }
    }

    if (addToHistory) {
      history.pushState({ route }, null, route);
    }
    window.scrollX = 0;
    window.scrollY = 0;
  }

  cleanup() {
    for (const t of this.trash) {
      t();
    }
  }
}
