import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  query,
  where,
  Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "../firebase";
import type {
  BaseBeverageType,
  CreamerType,
  SyrupType,
} from "../types/beverage";

export interface BeverageDoc {
  id: string;
  name: string;
  temp: string;
  base: BaseBeverageType;
  creamer: CreamerType;
  syrup: SyrupType;
  uid: string;
  createdAt: number;
}

interface BeverageStoreState {
  // Ingredient catalogs (loaded from Firestore)
  bases: BaseBeverageType[];
  creamers: CreamerType[];
  syrups: SyrupType[];

  // Temperatures are a fixed two-option list
  temps: string[];

  // Current selections the user is working on
  currentTemp: string;
  currentBase: BaseBeverageType | null;
  currentCreamer: CreamerType | null;
  currentSyrup: SyrupType | null;
  currentName: string;

  // Auth + saved beverages
  user: User | null;
  beverages: BeverageDoc[];
  currentBeverage: BeverageDoc | null;

  // UI messaging
  message: string;

  // Internal: Firestore listener handle for the current user
  _beveragesUnsub: Unsubscribe | null;
  _initialized: boolean;
}

export const useBeverageStore = defineStore("BeverageStore", {
  state: (): BeverageStoreState => ({
    bases: [],
    creamers: [],
    syrups: [],
    temps: ["Hot", "Cold"],

    currentTemp: "Hot",
    currentBase: null,
    currentCreamer: null,
    currentSyrup: null,
    currentName: "",

    user: null,
    beverages: [],
    currentBeverage: null,

    message: "",

    _beveragesUnsub: null,
    _initialized: false,
  }),

  actions: {
    /**
     * Loads the ingredient catalogs (bases / creamers / syrups) from Firestore
     * and seeds the "current" selections with sensible defaults. Runs once.
     */
    async init() {
      if (this._initialized) return;

      try {
        const [basesSnap, creamersSnap, syrupsSnap] = await Promise.all([
          getDocs(collection(db, "bases")),
          getDocs(collection(db, "creamers")),
          getDocs(collection(db, "syrups")),
        ]);

        this.bases = basesSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as BaseBeverageType),
        );
        this.creamers = creamersSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as CreamerType),
        );
        this.syrups = syrupsSnap.docs.map(
          (d) => ({ id: d.id, ...d.data() } as SyrupType),
        );

        // Default selections (first item of each list, Hot temperature)
        this.currentTemp = this.temps[0];
        this.currentBase = this.bases[0] ?? null;
        this.currentCreamer = this.creamers[0] ?? null;
        this.currentSyrup = this.syrups[0] ?? null;

        this._initialized = true;
      } catch (err) {
        console.error("Failed to initialize store from Firestore:", err);
        this.message = "Failed to load ingredients from Firestore.";
      }
    },

    /**
     * Called whenever Firebase Auth state changes. Attaches a per-user
     * Firestore listener on the beverages collection so the UI always
     * reflects only the signed-in user's data.
     */
    setUser(user: User | null) {
      // Tear down any existing listener before switching users
      if (this._beveragesUnsub) {
        this._beveragesUnsub();
        this._beveragesUnsub = null;
      }

      this.user = user;
      this.beverages = [];
      this.currentBeverage = null;

      if (!user) {
        // Logged out: nothing to listen to
        return;
      }

      const q = query(
        collection(db, "beverages"),
        where("uid", "==", user.uid),
      );

      this._beveragesUnsub = onSnapshot(
        q,
        (snap) => {
          this.beverages = snap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as BeverageDoc),
          );

          // Keep currentBeverage in sync with the live list
          if (this.beverages.length === 0) {
            this.currentBeverage = null;
          } else if (
            !this.currentBeverage ||
            !this.beverages.find((b) => b.id === this.currentBeverage!.id)
          ) {
            this.currentBeverage = this.beverages[0];
          }
        },
        (err) => {
          console.error("Beverage listener error:", err);
          this.message = "Could not load your saved beverages.";
        },
      );
    },

    /**
     * Loads a saved beverage into the "current" selections so the preview
     * mug reflects it.
     */
    selectBeverage(bev: BeverageDoc) {
      this.currentBeverage = bev;
      this.currentTemp = bev.temp;
      this.currentBase = bev.base;
      this.currentCreamer = bev.creamer;
      this.currentSyrup = bev.syrup;
      this.currentName = bev.name;
    },

    /**
     * Validates inputs, writes the beverage document to Firestore, and
     * returns a user-facing status message.
     */
    async makeBeverage(): Promise<string> {
      if (!this.user) {
        this.message = "No user logged in, please sign in first.";
        return this.message;
      }

      if (
        !this.currentBase ||
        !this.currentCreamer ||
        !this.currentSyrup ||
        !this.currentTemp ||
        !this.currentName.trim()
      ) {
        this.message =
          "Please complete all beverage options and the name before making a beverage.";
        return this.message;
      }

      const id = `bev_${this.user.uid}_${Date.now()}`;
      const bev: BeverageDoc = {
        id,
        name: this.currentName.trim(),
        temp: this.currentTemp,
        base: this.currentBase,
        creamer: this.currentCreamer,
        syrup: this.currentSyrup,
        uid: this.user.uid,
        createdAt: Date.now(),
      };

      try {
        await setDoc(doc(db, "beverages", id), bev);

        // Optimistic update — the onSnapshot listener will also reconcile this
        if (!this.beverages.find((b) => b.id === id)) {
          this.beverages = [...this.beverages, bev];
        }
        this.currentBeverage = bev;

        this.message = `Beverage ${bev.name} made successfully!`;
        return this.message;
      } catch (err) {
        console.error("Failed to save beverage:", err);
        this.message = "Failed to save beverage. Please try again.";
        return this.message;
      }
    },
  },
});

export type { BaseBeverageType, CreamerType, SyrupType, BeverageType };
