import { type User } from "firebase/auth";
import { ref, onValue, onDisconnect, serverTimestamp as rtdbServerTimestamp, set } from "firebase/database";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, rtdb } from "../firebase/config";

const HEARTBEAT_INTERVAL_MS = 60_000;
let stopPresence: (() => void) | null = null;

async function touchFirestorePresence(uid: string, isOnline: boolean) {
  if (!db) return;
  await setDoc(
    doc(db, "users", uid),
    {
      isOnline,
      lastSeenAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function stopPresenceTracking() {
  if (stopPresence) {
    stopPresence();
    stopPresence = null;
  }
}

export function startPresenceTracking(user: User) {
  stopPresenceTracking();

  if (!rtdb) {
    void touchFirestorePresence(user.uid, true);
    const intervalId = window.setInterval(() => {
      void touchFirestorePresence(user.uid, true);
    }, HEARTBEAT_INTERVAL_MS);

    const markOffline = () => {
      void touchFirestorePresence(user.uid, false);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        markOffline();
      } else {
        void touchFirestorePresence(user.uid, true);
      }
    };

    window.addEventListener("beforeunload", markOffline);
    document.addEventListener("visibilitychange", onVisibilityChange);

    stopPresence = () => {
      window.clearInterval(intervalId);
      window.removeEventListener("beforeunload", markOffline);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      void touchFirestorePresence(user.uid, false);
    };
    return;
  }

  const statusRef = ref(rtdb, `status/${user.uid}`);
  const connectedRef = ref(rtdb, ".info/connected");
  let heartbeatId: number | null = window.setInterval(() => {
    void touchFirestorePresence(user.uid, true);
  }, HEARTBEAT_INTERVAL_MS);
  void touchFirestorePresence(user.uid, true);

  const unsubscribeConnection = onValue(connectedRef, async (snap) => {
    if (snap.val() !== true) return;

    try {
      await onDisconnect(statusRef).set({
        state: "offline",
        lastChanged: rtdbServerTimestamp(),
      });

      await set(statusRef, {
        state: "online",
        lastChanged: rtdbServerTimestamp(),
      });
    } catch {
      // Firestore heartbeat remains active as a fallback.
    }

    void touchFirestorePresence(user.uid, true);
  });

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      void touchFirestorePresence(user.uid, true);
      void set(statusRef, { state: "online", lastChanged: rtdbServerTimestamp() }).catch(() => undefined);
    } else {
      void touchFirestorePresence(user.uid, false);
      void set(statusRef, { state: "offline", lastChanged: rtdbServerTimestamp() }).catch(() => undefined);
    }
  };

  const onBeforeUnload = () => {
    void touchFirestorePresence(user.uid, false);
    void set(statusRef, { state: "offline", lastChanged: rtdbServerTimestamp() }).catch(() => undefined);
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("beforeunload", onBeforeUnload);

  stopPresence = () => {
    unsubscribeConnection();
    if (heartbeatId !== null) {
      window.clearInterval(heartbeatId);
      heartbeatId = null;
    }
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("beforeunload", onBeforeUnload);
    void set(statusRef, { state: "offline", lastChanged: rtdbServerTimestamp() }).catch(() => undefined);
    void touchFirestorePresence(user.uid, false);
  };
}
