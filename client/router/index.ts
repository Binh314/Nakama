import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import EventFeedView from "../views/EventFeedView.vue";
import EventModeInfoView from "../views/EventModeInfoView.vue";
import EventModeView from "../views/EventModeView.vue";
import EventView from "../views/EventView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import MessageView from "../views/MessageView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import SettingView from "../views/SettingView.vue";
import TestView from "../views/TestView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "EventModeInfo",
      component: EventModeInfoView,
    },
    {
      path: "/EventMode",
      name: "EventMode",
      component: EventModeView,
    },
    {
      path: "/events",
      name: "Events",
      component: EventFeedView,
    },
    {
      path: "/event/:id",
      name: "Event",
      component: EventView,
    },
    {
      path: "/messages/:username?",
      name: "Messages",
      component: MessageView,
    },
    {
      path: "/profile/:username",
      name: "Profile",
      component: ProfileView,
    },
    {
      path: "/test",
      name: "Test",
      component: TestView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
