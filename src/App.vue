<template>
  <div>
    <Beverage :isIced="store.currentTemp === 'Cold'" />
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
      <li>
        <label for="beverage-name">Name</label>
        <input
          id="beverage-name"
          type="text"
          v-model="store.beverageName"
        />
        <button @click="store.makeBeverage()">Make Beverage</button>
      </li>
    </ul>

    <div id="beverage-container">
      <template v-for="beverage in store.savedBeverages" :key="beverage.id">
        <label>
          <input
            type="radio"
            name="saved-beverage"
            :value="beverage"
            @change="store.showBeverage(beverage)"
          />
          {{ beverage.name }}
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";

const store = useBeverageStore();
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
