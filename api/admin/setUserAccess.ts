import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "../_lib/firebaseAdmin.js";
import {
  ApiError,
  handleError,
  json,
  requireAdminUid,
  requirePost,
  requireString,
} from "../_lib/http.js";
import { requireOptionalBoolean } from "./_lib/common.js";

async function hasAnotherEnabledAdmin(excludedUid: string) {
  let pageToken: string | undefined;
  do {
    const result = await adminAuth.listUsers(1000, pageToken);
    for (const user of result.users) {
      if (user.uid === excludedUid) continue;
      if (user.customClaims?.admin === true && !user.disabled) {
        return true;
      }
    }
    pageToken = result.pageToken;
  } while (pageToken);

  return false;
}

export default async function handler(req: any, res: any) {
  try {
    requirePost(req);
    const adminUid = await requireAdminUid(req);
    const payload = (req.body ?? {}) as Record<string, unknown>;

    const uid = requireString(payload.uid, "uid");
    const disabled = requireOptionalBoolean(payload.disabled, "disabled");
    if (disabled === undefined) {
      throw new ApiError("invalid-argument", "Missing 'disabled'.", 400);
    }
    if (uid === adminUid && disabled) {
      throw new ApiError("failed-precondition", "You cannot disable your own admin account.", 409);
    }

    if (disabled) {
      const targetUser = await adminAuth.getUser(uid);
      if (targetUser.customClaims?.admin === true) {
        const anotherAdminExists = await hasAnotherEnabledAdmin(uid);
        if (!anotherAdminExists) {
          throw new ApiError("failed-precondition", "Cannot disable the last enabled admin account.", 409);
        }
      }
    }

    await adminAuth.updateUser(uid, { disabled });
    await adminDb.collection("users").doc(uid).set(
      {
        disabled,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await adminDb.collection("auditLogs").add({
      action: "admin.setUserAccess",
      actorUid: adminUid,
      target: { type: "user", id: uid },
      after: { disabled },
      createdAt: FieldValue.serverTimestamp(),
    });

    return json(res, 200, { ok: true, uid, disabled });
  } catch (error) {
    return handleError(res, error);
  }
}
