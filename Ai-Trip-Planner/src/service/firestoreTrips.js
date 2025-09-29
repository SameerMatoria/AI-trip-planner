import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/service/firebaseConfig";

// Read one
export async function getTripById(id) {
  const snap = await getDoc(doc(db, "AITrips", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Fetch user's trips without orderBy to avoid composite-index requirements.
 * We'll sort on the client.
 */
export async function getUserTrips(email, pageSize = 200 /* adjust as needed */) {
  if (!email) return { items: [], nextCursor: null };
  try {
    const col = collection(db, "AITrips");
    const q = query(col, where("userEmail", "==", email), limit(pageSize));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { items, nextCursor: null };
  } catch (err) {
    console.error("[getUserTrips] Firestore error:", err);
    throw err;
  }
}

export async function deleteTrip(docId) {
  await deleteDoc(doc(db, "AITrips", docId));
}

export async function renameTrip(docId, newTitle) {
  await updateDoc(doc(db, "AITrips", docId), {
    "userSelection.customTitle": newTitle,
    updatedAt: new Date(),
  });
}

export async function duplicateTrip(docId) {
  const src = await getDoc(doc(db, "AITrips", docId));
  if (!src.exists()) throw new Error("Source not found");
  const data = src.data();
  const newId = Date.now().toString();
  await setDoc(doc(db, "AITrips", newId), {
    ...data,
    id: newId,
    duplicatedFrom: docId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return newId;
}

export function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
