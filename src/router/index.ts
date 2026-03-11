import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/LandingPage.vue"),
    },
    {
      path: "/:category/:subcategory",
      component: () => import("@/components/layouts/CategoryLayout.vue"),
      children: [
        {
          path: "",
          name: "category",
          component: () => import("@/pages/CategoryPage.vue"),
        },
      ],
    },
    {
      path: "/favorites",
      name: "favorites",
      component: () => import("@/pages/FavoritesPage.vue"),
    },
  ],
});

export default router;
