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
  //Si la ruta pide autentificación y el usuario no está logueado
  //Lo redireccionamos a la página de login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: "Login" });
  }
  //Si el usuario está logueado y quiere ir a la página de login
  //Lo redireccionamos a la página de conversion
  if (to.name === "Login" && isAuthenticated) {
    next({ name: "Conversion" });
  }
  //Si el usuario está logueado y quiere ir a la página de historial
  if (isAuthenticated) {
    const tokenDecoded = jwtDecode(token);
    const isAdmin = tokenDecoded.role === "admin";
    //Si la ruta pide que el usuario sea admin y el usuario no es admin
    //Lo redireccionamos a la página de acceso denegado
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
