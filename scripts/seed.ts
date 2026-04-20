/**
 * One-time seed script for the bases / creamers / syrups collections.
 *
 * Usage:
 *   1. Make sure src/firebase.ts has your real Firebase config.
 *   2. Temporarily loosen your Firestore rules so an unauthenticated client
 *      can write (or run this from a signed-in browser context).
 *   3. Run:  npx tsx scripts/seed.ts
 *      (install tsx first if needed:  npm i -D tsx)
 *
 * Alternatively, you can add the documents manually in the Firebase Console.
 */
import { doc, setDoc } from "firebase/firestore";
import { db } from "../src/firebase";

const bases = [
  { id: "b1", name: "Black Tea", color: "#8B4513" },
  { id: "b2", name: "Green Tea", color: "#C8E6C9" },
  { id: "b3", name: "Coffee", color: "#6F4E37" },
];

const creamers = [
  { id: "c1", name: "No Cream", color: "transparent" },
  { id: "c2", name: "Milk", color: "AliceBlue" },
  { id: "c3", name: "Cream", color: "#F5F5DC" },
  { id: "c4", name: "Half & Half", color: "#FFFACD" },
];

const syrups = [
  { id: "s1", name: "No Syrup", color: "transparent" },
  { id: "s2", name: "Vanilla", color: "#FFEFD5" },
  { id: "s3", name: "Caramel", color: "#DAA520" },
  { id: "s4", name: "Hazelnut", color: "#6B4423" },
];

async function seed() {
  console.log("Seeding bases...");
  for (const b of bases) {
    await setDoc(doc(db, "bases", b.id), { name: b.name, color: b.color });
  }

  console.log("Seeding creamers...");
  for (const c of creamers) {
    await setDoc(doc(db, "creamers", c.id), { name: c.name, color: c.color });
  }

  console.log("Seeding syrups...");
  for (const s of syrups) {
    await setDoc(doc(db, "syrups", s.id), { name: s.name, color: s.color });
  }

  console.log("Done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
