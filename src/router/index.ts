import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login/Login.vue";
import Dashboard from "../views/Dashboard/Dashboard.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("../views/Register/Register.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: "/teams",
      name: "Teams",
      component: () => import("../views/Teams/Teams.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("@MktApp:token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.path === "/login" && token) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
