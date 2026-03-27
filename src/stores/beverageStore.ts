import { defineStore } from "pinia";
import bases from "../data/bases.json";
import creamers from "../data/creamers.json";
import syrups from "../data/syrups.json";
import temperatures from "../data/tempretures.json";

interface BaseBeverageType {
  id: string;
  name: string;
  color: string;
}

interface CreamerType {
  id: string;
  name: string;
  color: string;
}

interface SyrupType {
  id: string;
  name: string;
  color: string;
}

interface BeverageType {
  id: string;
  name: string;
  temp: string;
  base: BaseBeverageType;
  syrup: SyrupType;
  creamer: CreamerType;
}

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: temperatures as string[],
    bases: bases as BaseBeverageType[],
    creamers: creamers as CreamerType[],
    syrups: syrups as SyrupType[],

    currentTemp: temperatures[0] as string,
    currentBase: bases[0] as BaseBeverageType,
    currentCreamer: creamers[0] as CreamerType,
    currentSyrup: syrups[0] as SyrupType,

    beverageName: "" as string,
    savedBeverages: [] as BeverageType[],
  }),

  actions: {
    makeBeverage() {
      if (!this.beverageName.trim()) return;
      const newBeverage: BeverageType = {
        id: crypto.randomUUID(),
        name: this.beverageName.trim(),
        temp: this.currentTemp,
        base: { ...this.currentBase },
        syrup: { ...this.currentSyrup },
        creamer: { ...this.currentCreamer },
      };
      this.savedBeverages.push(newBeverage);
      this.beverageName = "";
    },

    showBeverage(beverage: BeverageType) {
      this.currentTemp = beverage.temp;
      this.currentBase = { ...beverage.base };
      this.currentSyrup = { ...beverage.syrup };
      this.currentCreamer = { ...beverage.creamer };
    },
  },
});

export type { BaseBeverageType, CreamerType, SyrupType, BeverageType };
