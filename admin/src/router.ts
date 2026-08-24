import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "dashboard",
            component: () => import("./pages/dashboard/index.vue"),
            meta: { title: "工作台" },
        },
        {
            path: "/login",
            name: "login",
            component: () => import("./pages/login.vue"),
            meta: { title: "登录" },
        },
    ],
});
