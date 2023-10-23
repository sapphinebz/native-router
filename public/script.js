import { Router } from "./router.js";
import { HomeComponent } from "./routes/home.js";
import { AboutComponent } from "./routes/about.js";
const router = new Router();
router.init([
  {
    path: "/",
    redirectTo: "/home",
  },
  {
    path: "/home",
    component: HomeComponent,
  },
  {
    path: "/about",
    component: AboutComponent,
  },
]);
