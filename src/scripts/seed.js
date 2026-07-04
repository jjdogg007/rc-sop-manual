/**
 * One-time Firestore seed utility.
 *
 * Usage (dev only):
 *   import { seedFirestore } from "./scripts/seed.js";
 *   seedFirestore();
 *
 * Or click the "Seed DB" button that appears in the app when
 * import.meta.env.DEV is true and Firebase is configured.
 *
 * Run this ONCE after setting up your Firebase project.
 * Subsequent runs will overwrite existing section documents but
 * will append duplicate policy-log entries — clear the policyLog
 * collection manually before re-seeding if needed.
 */

import { db } from "../firebase.js";
import {
  doc,
  writeBatch,
  addDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { SECTIONS, POLICY_LOG } from "../data/sop.js";

export async function seedFirestore() {
  if (!db) {
    alert("Firebase is not configured. Add a .env file with your Firebase keys.");
    return;
  }

  try {
    // ── Seed sections via a single batch ────────────────────────────────────
    const batch = writeBatch(db);
    SECTIONS.forEach((section, index) => {
      const ref = doc(db, "sections", section.id);
      batch.set(ref, { ...section, order: index });
    });
    await batch.commit();
    console.log(`✅ Seeded ${SECTIONS.length} sections.`);

    // ── Clear existing policy-log entries, then re-seed ──────────────────────
    const existingSnap = await getDocs(collection(db, "policyLog"));
    const clearBatch = writeBatch(db);
    existingSnap.docs.forEach((d) => clearBatch.delete(d.ref));
    await clearBatch.commit();

    for (let i = 0; i < POLICY_LOG.length; i++) {
      await addDoc(collection(db, "policyLog"), {
        ...POLICY_LOG[i],
        order: i,
        createdAt: new Date().toISOString(),
      });
    }
    console.log(`✅ Seeded ${POLICY_LOG.length} policy-log entries.`);

    alert("✅ Firestore seeded successfully! You can remove the Seed DB button now.");
  } catch (err) {
    console.error("Seed failed:", err);
    alert(`❌ Seed failed: ${err.message}`);
  }
}
