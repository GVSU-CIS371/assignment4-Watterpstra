import { createApp } from "vue";
import { createPinia } from "pinia";
import { onAuthStateChanged } from "firebase/auth";
import "./styles/mug.scss";
import App from "./App.vue";
import { auth } from "./firebase";
import { useBeverageStore } from "./stores/beverageStore";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

const store = useBeverageStore();

// Load ingredient catalogs from Firestore BEFORE mounting so the UI has data.
store.init().finally(() => {
  app.mount("#app");

  // Watch auth state and keep the store (and its per-user Firestore listener)
  // in sync. This also runs once on page load to restore an existing session.
  onAuthStateChanged(auth, (user) => {
    store.setUser(user);
  });
});
