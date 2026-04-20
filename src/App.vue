<template>
  <div>
    <Beverage />
    <ul>
      <li>
        <template v-for="temp in store.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="store.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
      <li>
        <template v-for="base in store.bases" :key="base.id">
          <label>
            <input
              type="radio"
              name="base"
              :id="base.id"
              :value="base"
              v-model="store.currentBase"
            />
            {{ base.name }}
          </label>
        </template>
      </li>
      <li>
        <template v-for="syrup in store.syrups" :key="syrup.id">
          <label>
            <input
              type="radio"
              name="syrup"
              :id="syrup.id"
              :value="syrup"
              v-model="store.currentSyrup"
            />
            {{ syrup.name }}
          </label>
        </template>
      </li>
      <li>
        <template v-for="creamer in store.creamers" :key="creamer.id">
          <label>
            <input
              type="radio"
              name="creamer"
              :id="creamer.id"
              :value="creamer"
              v-model="store.currentCreamer"
            />
            {{ creamer.name }}
          </label>
        </template>
      </li>

      <!-- Auth controls: sits above the name bar -->
      <li>
        <template v-if="store.user">
          <span>Signed in as {{ store.user.displayName || store.user.email }}</span>
          <button @click="signOutUser">Sign out</button>
        </template>
        <template v-else>
          <button @click="withGoogle">Sign in with Google</button>
        </template>
      </li>

      <!-- Message area -->
      <li v-if="store.message">
        <span>{{ store.message }}</span>
      </li>

      <!-- Name input -->
      <li>
        <label>
          Name:
          <input
            type="text"
            placeholder="Name your beverage"
            v-model="store.currentName"
          />
        </label>
      </li>

      <!-- Make Beverage -->
      <li>
        <button :disabled="!store.user" @click="onMakeBeverage">
          Make Beverage
        </button>
      </li>

      <!-- Saved beverages (only when signed in and list is non-empty) -->
      <li v-if="store.user && store.beverages.length">
        <strong>Saved:</strong>
        <template v-for="bev in store.beverages" :key="bev.id">
          <label>
            <input
              type="radio"
              name="savedBeverage"
              :value="bev.id"
              :checked="store.currentBeverage?.id === bev.id"
              @change="store.selectBeverage(bev)"
            />
            {{ bev.name }}
          </label>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";

const store = useBeverageStore();

async function withGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    store.message = "";
    // setUser is handled by onAuthStateChanged in main.ts
  } catch (err: any) {
    console.error("Google sign-in failed:", err);
    store.message = `Sign-in failed: ${err?.message ?? "Unknown error"}`;
  }
}

async function signOutUser() {
  try {
    await signOut(auth);
    store.message = "";
  } catch (err: any) {
    console.error("Sign-out failed:", err);
    store.message = `Sign-out failed: ${err?.message ?? "Unknown error"}`;
  }
}

async function onMakeBeverage() {
  await store.makeBeverage();
}
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  margin: 0.4em 0;
}
label {
  margin-right: 1em;
  cursor: pointer;
}
</style>