import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { parseTimestamp } from "./firestoreUtils";

export interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getUserBadges(uid: string): Promise<UserBadge[]> {
  if (!db) return [];

  const snap = await getDocs(collection(db, "users", uid, "badges"));
  return snap.docs
    .map((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>;
      return {
        id: docSnap.id,
        name: typeof data.name === "string" ? data.name : docSnap.id,
        icon: typeof data.icon === "string" ? data.icon : "Badge",
        description: typeof data.description === "string" ? data.description : "",
        earned: data.earned === true,
        order: typeof data.order === "number" ? data.order : Number.MAX_SAFE_INTEGER,
        createdAt: parseTimestamp(data.createdAt),
        updatedAt: parseTimestamp(data.updatedAt),
      } satisfies UserBadge;
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}
