import { createRouter, createWebHistory } from "vue-router";
import jwtDecode from "jwt-decode";
import Login from "../pages/Login.vue";
import Historial from "../pages/Historial.vue";
import Conversion from "../pages/Conversion.vue";
import AccesoDenegado from "../pages/AccesoDenegado.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/historial",
    name: "Historial",
    component: Historial,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/conversion",
    name: "Conversion",
    component: Conversion,
    meta: { requiresAuth: true },
  },
  {
    path: "/accesodenegado",
    name: "AccesoDenegado",
    component: AccesoDenegado,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token !== null;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  }
  if (to.name === "Login" && isAuthenticated) {
    next({ name: "Conversion" });
  }
  if (isAuthenticated) {
    const tokenDecoded = jwtDecode(token);
    const isAdmin = tokenDecoded.role === "admin";
    if (to.meta.requiresAdmin && !isAdmin) {
      next({ name: "AccesoDenegado" });
    } else {
      next();
    }
  }else{
    next();
  }

});
export default router;
