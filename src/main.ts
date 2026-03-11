import "./css/main.css";
import 'primeicons/primeicons.css';

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ToastService from "primevue/toastservice";
import Aura from "@primeuix/themes/aura";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Select from "primevue/select";
import Toast from "primevue/toast";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, { theme: { preset: Aura } });
app.use(ToastService);

app.component("ButtonPrimevue", Button);
app.component("ToastPrimevue", Toast);
app.component("SelectPrimevue", Select);

app.mount("#app");
