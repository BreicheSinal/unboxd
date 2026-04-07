import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/config";

export async function uploadUserAvatar(uid: string, file: File) {
  if (!storage) throw new Error("Firebase Storage is not configured");
  const path = `users/${uid}/avatars/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return { url, path };
}

export async function uploadClosetShirtImage(uid: string, shirtId: string, file: File) {
  if (!storage) throw new Error("Firebase Storage is not configured");
  const path = `users/${uid}/shirts/${shirtId}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return { url, path };
}

export async function uploadMarketplaceAsset(listingId: string, file: File) {
  if (!storage) throw new Error("Firebase Storage is not configured");
  const path = `marketplace/${listingId}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  return { url, path };
}

export async function deleteStorageAsset(path: string) {
  if (!storage) throw new Error("Firebase Storage is not configured");
  await deleteObject(ref(storage, path));
}
